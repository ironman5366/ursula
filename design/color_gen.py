#!/usr/bin/env python3
import json
import sys

def generate_color_palette(hex_color):
    # Convert hex color to RGB
    hex_color = hex_color.lstrip('#')
    r, g, b = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

    # Calculate the step size for each color component
    r_step = (255 - r) / 11
    g_step = (255 - g) / 11
    b_step = (255 - b) / 11

    # Generate lighter colors
    lighter_colors = []
    for i in range(11):
        lighter_r = int(r + r_step * i)
        lighter_g = int(g + g_step * i)
        lighter_b = int(b + b_step * i)
        lighter_color = f"#{lighter_r:02x}{lighter_g:02x}{lighter_b:02x}"
        lighter_colors.append(lighter_color)

    # Add white as the lightest color
    lighter_colors.append("#ffffff")

    # Calculate the step size for each color component (for darker colors)
    r_step = r / 11
    g_step = g / 11
    b_step = b / 11

    # Generate darker colors
    darker_colors = []
    for i in range(11):
        darker_r = int(r - r_step * i)
        darker_g = int(g - g_step * i)
        darker_b = int(b - b_step * i)
        darker_color = f"#{darker_r:02x}{darker_g:02x}{darker_b:02x}"
        darker_colors.append(darker_color)

    # Add black as the darkest color
    darker_colors.append("#000000")

    return lighter_colors, darker_colors

if __name__ == "__main__":
    lighter, darker = generate_color_palette(sys.argv[1])
    print("lighter", lighter)
    print("darker", darker)
    print(json.dumps([lighter, darker], indent=4))
