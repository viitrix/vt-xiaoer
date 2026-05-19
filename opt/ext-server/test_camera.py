#!/usr/bin/env python3
"""List real USB camera devices and capture JPG snapshots."""

import argparse
import os
import shutil
import subprocess
import sys
import time


def list_usb_cameras():
    cameras = []
    video_dir = "/sys/class/video4linux"

    if not os.path.isdir(video_dir):
        print("No video4linux subsystem found.")
        return cameras

    def read_attr(path):
        try:
            with open(path) as f:
                return f.read().strip()
        except (FileNotFoundError, PermissionError):
            return ""

    for entry in sorted(os.listdir(video_dir)):
        dev_path = os.path.realpath(os.path.join(video_dir, entry))
        if "/usb" not in dev_path:
            continue

        usb_dev_path = dev_path
        while usb_dev_path != "/":
            if os.path.exists(os.path.join(usb_dev_path, "idVendor")):
                break
            usb_dev_path = os.path.dirname(usb_dev_path)
        else:
            continue

        vendor_id = read_attr(os.path.join(usb_dev_path, "idVendor"))
        product_id = read_attr(os.path.join(usb_dev_path, "idProduct"))
        manufacturer = read_attr(os.path.join(usb_dev_path, "manufacturer"))
        product = read_attr(os.path.join(usb_dev_path, "product"))
        serial = read_attr(os.path.join(usb_dev_path, "serial"))
        name = read_attr(os.path.join(dev_path, "name"))

        dev_node = ""
        dev_t = read_attr(os.path.join(dev_path, "dev"))
        if dev_t:
            major, minor = dev_t.split(":")
            for node in os.listdir("/dev"):
                if not node.startswith("video"):
                    continue
                try:
                    st = os.stat(os.path.join("/dev", node))
                    if os.major(st.st_rdev) == int(major) and os.minor(st.st_rdev) == int(minor):
                        dev_node = f"/dev/{node}"
                        break
                except (FileNotFoundError, OSError):
                    continue

        cameras.append({
            "name": name,
            "vendor_id": vendor_id,
            "product_id": product_id,
            "manufacturer": manufacturer,
            "product": product,
            "serial": serial,
            "device": dev_node,
            "usb_path": usb_dev_path,
        })

    return cameras


def capture_jpg(device, output_path, width=1280, height=720):
    """Capture a single JPG frame from a V4L2 device using ffmpeg."""
    if not shutil.which("ffmpeg"):
        print("Error: ffmpeg not found. Install it with: sudo apt install ffmpeg")
        sys.exit(1)

    cmd = [
        "ffmpeg",
        "-y",                          # overwrite output
        "-f", "v4l2",
        "-input_format", "mjpeg",
        "-video_size", f"{width}x{height}",
        "-i", device,
        "-frames:v", "1",
        "-q:v", "2",                   # high quality JPG
        output_path,
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        # Retry with yuyv422 if mjpeg is unsupported
        cmd[cmd.index("mjpeg")] = "yuyv422"
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"ffmpeg error:\n{result.stderr}")
            return None

    if os.path.isfile(output_path) and os.path.getsize(output_path) > 0:
        return output_path
    return None


def main():
    parser = argparse.ArgumentParser(description="List USB cameras and capture JPG snapshots")
    parser.add_argument("-c", "--capture", type=int, metavar="INDEX",
                        help="Capture a snapshot from camera INDEX (1-based)")
    parser.add_argument("-o", "--output", default="capture.jpg",
                        help="Output JPG path (default: capture.jpg)")
    parser.add_argument("-W", "--width", type=int, default=1280, help="Capture width (default: 1280)")
    parser.add_argument("-H", "--height", type=int, default=720, help="Capture height (default: 720)")
    args = parser.parse_args()

    cameras = list_usb_cameras()
    if not cameras:
        print("No USB cameras found.")
        return

    if args.capture is None:
        # List mode
        print(f"Found {len(cameras)} USB camera(s):\n")
        for i, cam in enumerate(cameras, 1):
            print(f"  [{i}] {cam['name']}")
            print(f"      USB ID:    {cam['vendor_id']}:{cam['product_id']}")
            if cam["manufacturer"]:
                print(f"      Vendor:    {cam['manufacturer']}")
            if cam["product"]:
                print(f"      Product:   {cam['product']}")
            if cam["serial"]:
                print(f"      Serial:    {cam['serial']}")
            if cam["device"]:
                print(f"      Device:    {cam['device']}")
            print(f"      Sysfs:     {cam['usb_path']}")
            print()
    else:
        # Capture mode
        idx = args.capture - 1
        if idx < 0 or idx >= len(cameras):
            print(f"Error: camera index {args.capture} out of range (1-{len(cameras)})")
            sys.exit(1)

        cam = cameras[idx]
        if not cam["device"]:
            print(f"Error: no /dev/videoX node found for '{cam['name']}'")
            sys.exit(1)

        print(f"Capturing from [{args.capture}] {cam['name']} ({cam['device']}) ...")
        path = capture_jpg(cam["device"], args.output, args.width, args.height)
        if path:
            size = os.path.getsize(path)
            print(f"Saved: {path} ({size:,} bytes)")
        else:
            print("Capture failed.")
            sys.exit(1)


if __name__ == "__main__":
    main()
