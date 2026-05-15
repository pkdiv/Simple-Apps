"use client";

import React, { useRef, useEffect } from "react";

interface ParticlesProps {
    className?: string;
    quantity?: number;
    staticity?: number;
    ease?: number;
    refresh?: boolean;
}

interface Circle {
    x: number;
    y: number;
    translateX: number;
    translateY: number;
    size: number;
    alpha: number;
    targetAlpha: number;
    dx: number;
    dy: number;
    magnetism: number;
}

export default function Particles({
    className = "",
    quantity = 30,
    staticity = 50,
    ease = 50,
    refresh = false,
}: ParticlesProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const context = useRef<CanvasRenderingContext2D | null>(null);
    const circles = useRef<Circle[]>([]);
    const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

    useEffect(() => {
        if (canvasRef.current) {
            context.current = canvasRef.current.getContext("2d");
        }
    }, []);

    useEffect(() => {
        const initCanvas = () => {
            resizeCanvas();
            drawParticles();
        };

        const resizeCanvas = () => {
            if (canvasContainerRef.current && canvasRef.current && context.current) {
                circles.current = [];
                canvasSize.current.w = canvasContainerRef.current.offsetWidth;
                canvasSize.current.h = canvasContainerRef.current.offsetHeight;
                canvasRef.current.width = canvasSize.current.w * dpr;
                canvasRef.current.height = canvasSize.current.h * dpr;
                canvasRef.current.style.width = `${canvasSize.current.w}px`;
                canvasRef.current.style.height = `${canvasSize.current.h}px`;
                context.current.scale(dpr, dpr);
            }
        };

        const circleParams = (): Circle => {
            const x = Math.floor(Math.random() * canvasSize.current.w);
            const y = Math.floor(Math.random() * canvasSize.current.h);
            const translateX = 0;
            const translateY = 0;
            const size = Math.floor(Math.random() * 2) + 0.1;
            const alpha = 0;
            const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
            const dx = (Math.random() - 0.5) * 0.2;
            const dy = (Math.random() - 0.5) * 0.2;
            const magnetism = 0.1 + Math.random() * 4;
            return {
                x,
                y,
                translateX,
                translateY,
                size,
                alpha,
                targetAlpha,
                dx,
                dy,
                magnetism,
            };
        };

        const drawCircle = (circle: Circle, update = false) => {
            if (context.current) {
                const { x, y, translateX, translateY, size, alpha } = circle;
                context.current.translate(translateX, translateY);
                context.current.beginPath();
                context.current.arc(x, y, size, 0, 2 * Math.PI);
                context.current.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                context.current.fill();
                context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

                if (!update) {
                    circles.current.push(circle);
                }
            }
        };

        const clearContext = () => {
            if (context.current) {
                context.current.clearRect(
                    0,
                    0,
                    canvasSize.current.w * dpr,
                    canvasSize.current.h * dpr,
                );
            }
        };

        const drawParticles = () => {
            clearContext();
            const particleCount = quantity;
            for (let i = 0; i < particleCount; i++) {
                const circle = circleParams();
                drawCircle(circle);
            }
        };

        const remapValue = (
            value: number,
            start1: number,
            stop1: number,
            start2: number,
            stop2: number,
        ): number => {
            const rel = (value - start1) / (stop1 - start1);
            return start2 + rel * (stop2 - start2);
        };

        const animate = () => {
            clearContext();
            circles.current.forEach((circle: Circle) => {
                const edge = [
                    circle.x + circle.translateX - circle.size,
                    canvasSize.current.w - circle.x - circle.translateX - circle.size,
                    circle.y + circle.translateY - circle.size,
                    canvasSize.current.h - circle.y - circle.translateY - circle.size,
                ];
                const closestEdge = Math.min(...edge);
                const remapClosestEdge = parseFloat(
                    remapValue(closestEdge, 0, 20, 0, 1).toFixed(2),
                );
                if (remapClosestEdge > 1) {
                    circle.alpha += 0.02;
                    if (circle.alpha > circle.targetAlpha) {
                        circle.alpha = circle.targetAlpha;
                    }
                } else {
                    circle.alpha = circle.targetAlpha * remapClosestEdge;
                }
                circle.x += circle.dx;
                circle.y += circle.dy;
                circle.translateX +=
                    (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
                    ease;
                circle.translateY +=
                    (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
                    ease;

                drawCircle(circle, true);
            });
            requestAnimationFrame(animate);
        };

        initCanvas();
        animate();
        window.addEventListener("resize", initCanvas);

        return () => {
            window.removeEventListener("resize", initCanvas);
        };
    }, [dpr, ease, quantity, refresh, staticity]);

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            mouse.current.x = x * dpr;
            mouse.current.y = y * dpr;
        }
    };

    return (
        <div
            className={className}
            ref={canvasContainerRef}
            aria-hidden="true"
            onMouseMove={onMouseMove}
        >
            <canvas ref={canvasRef} />
        </div>
    );
}
