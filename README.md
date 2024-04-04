# Ursula

A WIP book-ranking app with stack-ranking and AI recommendations.

## Download

### App Store:

<a href="https://apps.apple.com/us/app/ursula-books/id6478836951?itsct=apps_box_badge&amp;itscg=30200" style="display: inline-block; overflow: hidden; border-radius: 13px; width: 250px; height: 83px;"><img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1710979200" alt="Download on the App Store" style="border-radius: 13px; width: 30; height: 50px;"></a>

https://apple.co/4csWtE0

## Reference:

- Run local (if you have supabase running locally, in `mobile`): `npm run start:local`
- Run against prod (in `mobile`): `npm run start:dev`
- Build: `npm run build:ios`, `npm run build:android`
- Create a new migration: `npx supabase migration new [name]`
- Push a migration: `npx supabase db push`
- Update the types: `npm run write-types`

## Android Builds

Note to build on android you must have an ANDROID_HOME environment variable set to the location of your Android SDK.
This is usually in `~/Library/Android/sdk` on MacOS. You can follow instructions at
(https://docs.expo.dev/workflow/android-studio-emulator/) to configure this. For me (mac, ZSH), this meant
adding

```
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

to my ~/.zshrc.

As of writing (April 2, 2024), **you'll also need a JDK < 21 for react-native-async-storage** because of gradle
compatibility issues. For me, this meant:

```
brew install openjdk@17
sudo ln -sfn /opt/homebrew/opt/openjdk/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk.jdk
```
