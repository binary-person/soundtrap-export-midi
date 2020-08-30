# Soundtrap Export MIDI
## Disclaimer
This is for educational purposes only. This repo only exists to provide insight on Soundtrap's APIs and their `not` files. All parts of the app are coded by me. If Soundtrap wishes to take down the repo, I will take it down without hesitation. If so, contact me at loopingthroughlife@gmail.com.

## Setting up
Before anything, you need to get node and npm.

After that's done, you need to get the `jb_SESSION` cookie. To get this cookie, you need to go to any site with `https://www.soundtrap.com` on it. Of course, be sure to log in first.

For this tutorial, I'm going to use https://www.soundtrap.com/api/project/getProject1/ to avoid confusion. Now, open Chrome Dev Tools, then click on the "Network" tab. Hit refresh, and an entry named "getProject/" should appear with a red font.

Now, click on that entry, and select the "Headers" tab (should already been selected). Now, scroll down to "Request Headers". Copy all the cookies.

You should copy the area that is similar to the area taken up by "\_\_copyme__":
```
Accept-Language: en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7
Cache-Control: no-cache
Connection: keep-alive
Cookie: __copyme__
Host: www.soundtrap.com
Pragma: no-cache
```
Now, with the cookie, clone this repo and open up cookie.txt. Paste the cookie you copied earlier.

Finally, run `npm install` to install the repo's dependencies.

## Usage
Syntax:
```
node index.js PROJECT_ID INCLUDES_FLAG
```
A file named "export.mid" should appear when you run the command.

PROJECT_ID can be found in the URL `https://www.soundtrap.com/studio/PROJECT_ID/`

INCLUDES_FLAG is used to determine which tracks to export to midi. Leave blank for exporting all tracks. If INCLUDES_FLAG is set to "midi", for example, any track name with the word "midi" in it would be exported as midi.