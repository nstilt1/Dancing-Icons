# An Entertaining Home Screen
Moving app icons and icons responsive to music. Possible to integrate with the microphone at a concert, or the music that's currently playing. It might drain battery a little, but it looks cool.

I hope that at the very least, tech companies use this feature I have defined. I hope that if they sell this feature as an extension to their OS, that they give me a little kickback and/or a job for shining a light on this feature. But, with the license I have chosen, anyone can do whatever the hell they want with this idea I have brought forward.

The comments in the code explain how to use the "buttons" that I have laid out, and they also explain another way to make things move. They're more like sliders, but without displaying a value nor having a label.

Thhere could be an icon in the "Quick Settings Menu" and upon holding down the icon for floating apps, a menu could appear to change the settings of the floating behaviors.

# Optimizations
This program uses a bit of sine and cosine calculations, and those could be precalculated and stored in an array for easy access. There is also the option for SIMD optimization... but that isn't universally usable.


# To Run in VS Code:
It's not completely straight forward, but once you have the files in a directory in VSC, open a new terminal in that directory, then use a Python HTTP Server as detailed here:
https://github.com/processing/p5.js/wiki/Local-server
