# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
-renamesourcefileattribute SourceFile

# Keep Room database classes
-keep class * extends androidx.room.RoomDatabase
-keep @androidx.room.Entity class *
-keep @androidx.room.Dao class *
-dontwarn androidx.room.paging.**

# Keep Hilt generated classes
-keep class dagger.hilt.** { *; }
-keep class * extends dagger.hilt.android.HiltAndroidApp
-keepclasseswithmembers class * {
    @dagger.hilt.android.AndroidEntryPoint <methods>;
}
-keep class javax.inject.** { *; }
-keep class * extends javax.inject.Qualifier { *; }

# Keep Compose classes
-keep class androidx.compose.** { *; }
-dontwarn androidx.compose.**

# Keep iText classes
-keep class com.itextpdf.** { *; }
-dontwarn com.itextpdf.**

# Keep ESC/POS classes
-keep class com.dantsu.escposprinter.** { *; }
-dontwarn com.dantsu.escposprinter.**

# Keep Gson classes
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn sun.misc.**
-keep class com.google.gson.** { *; }
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer

# Keep MPAndroidChart
-keep class com.github.mikephil.charting.** { *; }
-dontwarn com.github.mikephil.charting.**

# Keep Kotlinx DateTime
-keep class kotlinx.datetime.** { *; }
-dontwarn kotlinx.datetime.**

# Keep WorkManager classes
-keep class androidx.work.** { *; }
-keep class * extends androidx.work.Worker
-keep class * extends androidx.work.InputMerger
-keepclassmembers class * extends androidx.work.Worker {
    public <init>(android.content.Context,androidx.work.WorkerParameters);
}

# Keep DataStore classes
-keep class androidx.datastore.** { *; }
-dontwarn androidx.datastore.**

# Keep Bluetooth classes
-keep class android.bluetooth.** { *; }
-dontwarn android.bluetooth.**

# Keep permissions classes
-keep class com.google.accompanist.permissions.** { *; }
-dontwarn com.google.accompanist.permissions.**

# Keep model classes
-keep class com.courierearn.domain.model.** { *; }
-keep class com.courierearn.data.model.** { *; }

# Keep UI components
-keep class com.courierearn.presentation.ui.** { *; }
-keep class com.courierearn.presentation.ui.components.** { *; }

# Keep ViewModels
-keep class com.courierearn.presentation.viewmodel.** { *; }

# Keep UseCases
-keep class com.courierearn.domain.usecase.** { *; }

# Keep Repository classes
-keep class com.courierearn.data.repository.** { *; }

# Keep Application class
-keep class com.courierearn.CourierEarnApplication { *; }

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep enums
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Keep Parcelable implementations
-keep class * implements android.os.Parcelable {
    public static final ** CREATOR;
}

# Keep Serializable implementations
-keepnames class * implements java.io.Serializable
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# Keep R class
-keepclassmembers class **.R$* {
    public static <fields>;
}

# Keep BuildConfig
-keep class com.courierearn.BuildConfig { *; }

# Optimization rules
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*
-optimizationpasses 5
-allowaccessmodification
-dontpreverify
