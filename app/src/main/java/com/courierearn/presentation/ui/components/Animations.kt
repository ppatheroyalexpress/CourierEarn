package com.courierearn.presentation.ui.components

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.TransformOrigin
import androidx.compose.ui.unit.dp

/**
 * Animation Components for Consistent UI Experience
 * Provides smooth transitions and micro-interactions
 */

@Composable
fun FadeInAnimation(
    content: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    duration: Int = 300
) {
    val fadeIn = remember {
        fadeIn(
            animationSpec = tween(
                durationMillis = duration,
                easing = EaseInOut
            )
        )
    }
    
    AnimatedVisibility(
        visible = true,
        enter = fadeIn,
        modifier = modifier
    ) {
        content()
    }
}

@Composable
fun SlideInAnimation(
    content: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    slideDirection: SlideDirection = SlideDirection.Up,
    duration: Int = 300
) {
    val slideIn = remember(slideDirection) {
        when (slideDirection) {
            SlideDirection.Up -> slideInVertically(
                initialOffsetY = { it },
                animationSpec = tween(durationMillis = duration, easing = EaseOutQuart)
            )
            SlideDirection.Down -> slideInVertically(
                initialOffsetY = { -it },
                animationSpec = tween(durationMillis = duration, easing = EaseOutQuart)
            )
            SlideDirection.Left -> slideInHorizontally(
                initialOffsetX = { it },
                animationSpec = tween(durationMillis = duration, easing = EaseOutQuart)
            )
            SlideDirection.Right -> slideInHorizontally(
                initialOffsetX = { -it },
                animationSpec = tween(durationMillis = duration, easing = EaseOutQuart)
            )
        }
    }
    
    AnimatedVisibility(
        visible = true,
        enter = slideIn,
        modifier = modifier
    ) {
        content()
    }
}

@Composable
fun ScaleInAnimation(
    content: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    duration: Int = 200
) {
    val scaleIn = remember {
        scaleIn(
            animationSpec = tween(
                durationMillis = duration,
                easing = EaseOutBack
            ),
            initialScale = 0.8f,
            transformOrigin = TransformOrigin.Center
        )
    }
    
    AnimatedVisibility(
        visible = true,
        enter = scaleIn,
        modifier = modifier
    ) {
        content()
    }
}

@Composable
fun PulseAnimation(
    content: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    targetScale: Float = 1.05f,
    duration: Int = 1000
) {
    val infiniteTransition = rememberInfiniteTransition()
    val scale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = targetScale,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = duration / 2, easing = EaseInOut),
            repeatMode = RepeatMode.Reverse
        )
    )
    
    Box(
        modifier = modifier.scale(scale)
    ) {
        content()
    }
}

@Composable
fun ShimmerAnimation(
    content: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    duration: Int = 1500
) {
    val infiniteTransition = rememberInfiniteTransition()
    val offsetX by infiniteTransition.animateFloat(
        initialValue = -300f,
        targetValue = 300f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = duration, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        )
    )
    
    Box(modifier = modifier) {
        content()
        
        // Shimmer overlay
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    brush = androidx.compose.ui.graphics.Brush.horizontalGradient(
                        colors = listOf(
                            Color.Transparent,
                            Color.White.copy(alpha = 0.3f),
                            Color.Transparent
                        ),
                        startX = offsetX - 300f,
                        endX = offsetX + 300f
                    )
                )
        )
    }
}

@Composable
fun BounceAnimation(
    content: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    isActive: Boolean = true,
    duration: Int = 600
) {
    val infiniteTransition = rememberInfiniteTransition()
    val offsetY by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = -10f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = duration / 2, easing = EaseOutBack),
            repeatMode = RepeatMode.Reverse
        )
    )
    
    Box(
        modifier = modifier.offset(y = if (isActive) offsetY.dp else 0.dp)
    ) {
        content()
    }
}

@Composable
fun RotationAnimation(
    content: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    isActive: Boolean = true,
    duration: Int = 2000
) {
    val infiniteTransition = rememberInfiniteTransition()
    val rotation by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = duration, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        )
    )
    
    Box(
        modifier = modifier
            .graphicsLayer {
                rotationZ = if (isActive) rotation else 0f
            }
    ) {
        content()
    }
}

@Composable
fun StaggeredAnimation(
    items: List<Any>,
    itemContent: @Composable (item: Any, index: Int) -> Unit,
    modifier: Modifier = Modifier,
    staggerDelay: Int = 100
) {
    Column(modifier = modifier) {
        items.forEachIndexed { index, item ->
            val delay = index * staggerDelay
            key(item) {
                FadeInAnimation(
                    modifier = Modifier.fillMaxWidth(),
                    duration = 300 + delay
                ) {
                    itemContent(item, index)
                }
            }
        }
    }
}

@Composable
fun CardFlipAnimation(
    isFlipped: Boolean,
    frontContent: @Composable () -> Unit,
    backContent: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    duration: Int = 600
) {
    val rotation by animateFloatAsState(
        targetValue = if (isFlipped) 180f else 0f,
        animationSpec = tween(durationMillis = duration, easing = EaseInOut)
    )
    
    Box(
        modifier = modifier
            .graphicsLayer {
                rotationY = rotation
                cameraDistance = 8000f
            }
    ) {
        if (rotation < 90f) {
            Box(
                modifier = Modifier.graphicsLayer {
                    rotationY = -rotation
                }
            ) {
                frontContent()
            }
        } else {
            Box(
                modifier = Modifier.graphicsLayer {
                    rotationY = 180f - rotation
                }
            ) {
                backContent()
            }
        }
    }
}

@Composable
fun LoadingDotsAnimation(
    modifier: Modifier = Modifier,
    dotCount: Int = 3,
    dotSize: Int = 8,
    color: Color = MaterialTheme.colorScheme.primary
) {
    val infiniteTransition = rememberInfiniteTransition()
    
    Row(
        modifier = modifier,
        horizontalArrangement = Arrangement.spacedBy(4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        repeat(dotCount) { index ->
            val delay = index * 100
            val scale by infiniteTransition.animateFloat(
                initialValue = 1f,
                targetValue = 1.5f,
                animationSpec = infiniteRepeatable(
                    animation = tween(
                        durationMillis = 600,
                        delayMillis = delay,
                        easing = EaseInOut
                    ),
                    repeatMode = RepeatMode.Reverse
                )
            )
            
            Box(
                modifier = Modifier
                    .size(dotSize.dp)
                    .scale(scale)
                    .background(
                        color = color,
                        shape = RoundedCornerShape(50)
                    )
            )
        }
    }
}

@Composable
fun SuccessAnimation(
    isVisible: Boolean,
    content: @Composable () -> Unit,
    modifier: Modifier = Modifier
) {
    val scale by animateFloatAsState(
        targetValue = if (isVisible) 1f else 0f,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessLow
        )
    )
    
    val alpha by animateFloatAsState(
        targetValue = if (isVisible) 1f else 0f,
        animationSpec = tween(durationMillis = 300)
    )
    
    Box(
        modifier = modifier
            .scale(scale)
            .graphicsLayer { this.alpha = alpha }
    ) {
        content()
    }
}

@Composable
fun ErrorShakeAnimation(
    isError: Boolean,
    content: @Composable () -> Unit,
    modifier: Modifier = Modifier
) {
    val offsetX by animateFloatAsState(
        targetValue = if (isError) 0f else 0f,
        animationSpec = if (isError) {
            tween(
                durationMillis = 500,
                easing = { fraction ->
                    // Create shake effect
                    val x = fraction * 6
                    when {
                        x < 1 -> -10f
                        x < 2 -> 10f
                        x < 3 -> -10f
                        x < 4 -> 10f
                        x < 5 -> -5f
                        else -> 0f
                    }
                }
            )
        } else {
            tween(0)
        }
    )
    
    Box(
        modifier = modifier.offset(x = offsetX.dp)
    ) {
        content()
    }
}

@Composable
fun SlideUpPanelAnimation(
    isVisible: Boolean,
    content: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    height: Int = 300
) {
    val slideOffset by animateDpAsState(
        targetValue = if (isVisible) 0.dp else height.dp,
        animationSpec = tween(durationMillis = 300, easing = EaseOutQuart)
    )
    
    Box(
        modifier = modifier
            .offset(y = slideOffset)
    ) {
        content()
    }
}

@Composable
fun CountUpAnimation(
    targetValue: Int,
    modifier: Modifier = Modifier,
    content: @Composable (value: Int) -> Unit
) {
    val animatedValue by animateIntAsState(
        targetValue = targetValue,
        animationSpec = tween(durationMillis = 1000, easing = EaseOutQuart)
    )
    
    content(animatedValue)
}

@Composable
fun MorphingAnimation(
    isActive: Boolean,
    firstContent: @Composable () -> Unit,
    secondContent: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    duration: Int = 300
) {
    val progress by animateFloatAsState(
        targetValue = if (isActive) 1f else 0f,
        animationSpec = tween(durationMillis = duration, easing = EaseInOut)
    )
    
    Box(modifier = modifier) {
        if (progress < 0.5f) {
            firstContent()
        } else {
            secondContent()
        }
    }
}

enum class SlideDirection {
    Up, Down, Left, Right
}

// Animation presets
object AnimationPresets {
    const val FAST_DURATION = 200
    const val NORMAL_DURATION = 300
    const val SLOW_DURATION = 500
    
    const val SMALL_STAGGER = 50
    const val NORMAL_STAGGER = 100
    const val LARGE_STAGGER = 150
}

// Easing functions
object EasingPresets {
    val EaseInOut = FastOutSlowInEasing
    val EaseOutQuart = Easing.OutQuart
    val EaseOutBack = Easing.OutBack
    val EaseInBack = Easing.InBack
    val EaseOutBounce = Easing.OutBounce
}
