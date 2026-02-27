new FinisherHeader({
    className: "finisher-header",
    count: 25,
    size: { min: 10, max: 10, pulse: 0.15 },
    speed: { x: { min: 0.05, max: 0.3 }, y: { min: 0.05, max: 0.6 } },
    colors: {
        background: "black",
        particles: ["white"]
    },
    blending: "screen",
    opacity: { center: 100, edge: 100 },
    skew: 0,
    shapes: ["c"]
});