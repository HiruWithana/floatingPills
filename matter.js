const matterContainer = document.getElementById("matter-container");

var Example = Example || {};

Example.fallingButtons = function () {
  var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Composite = Matter.Composite,
    Bodies = Matter.Bodies,
    Events = Matter.Events;

  var engine = Engine.create(),
    world = engine.world;

  // Get viewport width & height for responsiveness
  function getViewportSize() {
    return {
      width: window.innerWidth,
      height: Math.min(window.innerHeight * 0.6, 500), // Keep max height limited
    };
  }

  let viewport = getViewportSize();

  var render = Render.create({
    element: matterContainer,
    engine: engine,
    options: {
      width: matterContainer.clientWidth,
      height: matterContainer.clientHeight,
      showAngleIndicator: false,
      wireframes: false,
      background: "#16181D",
    },
  });

  Render.run(render);

  var runner = Runner.create();
  Runner.run(runner, engine);

  // Define button colors
  const buttonColors = ["#B984FD", "#48DDB0", "#F866B5", "#BEFE00", "#FFFFFF"];

  function getButtonColor(index) {
    return buttonColors[index % buttonColors.length];
  }

  // Button labels
  const buttonLabels = [
    "Responsive Design",
    "Gsap",
    "Figma to Webflow",
    "Front-End Development",
    "Web Animation",
    "UIUX Design",
    "SaaS",
    "wordpress",
    "Wordpress to Webflow",
    "No-Code",
    "Web Accessibility",
    "JS",
    "CSS",
    "Frameworks",
    "Webflow",
    "Prototyping",
  ];

  let buttons = [];
  var context = render.context;
  context.font = "20px Arial";

  function createButtons() {
    buttons.forEach((button) => Composite.remove(world, button));
    buttons = [];

    let spacing = window.innerWidth < 500 ? 0 : 70; // Set spacing based on screen size

    buttonLabels.forEach((label, index) => {
      let textWidth = context.measureText(label).width + 60;
      let button = Bodies.rectangle(100 + index * spacing, 0, textWidth, 50, {
        chamfer: { radius: 25 },
        render: { fillStyle: getButtonColor(index) },
        label: label,
      });

      buttons.push(button);
      Composite.add(world, button);
    });
  }

  // Run function on page load and window resize
  window.addEventListener("resize", createButtons);
  createButtons();

  createButtons();

  let walls = [];

  function createWalls() {
    walls.forEach((wall) => Composite.remove(world, wall));
    walls = [];

    let ground = Bodies.rectangle(
      matterContainer.clientWidth / 2,
      matterContainer.clientHeight + 50,
      matterContainer.clientWidth,
      100,
      {
        isStatic: true,
        render: { fillStyle: "red" }, // Change wall color to red
      }
    );

    let ceiling = Bodies.rectangle(
      matterContainer.clientWidth / 2,
      -25,
      matterContainer.clientWidth,
      50,
      {
        isStatic: true,
        render: { fillStyle: "red" },
      }
    );

    let leftWall = Bodies.rectangle(
      -25,
      matterContainer.clientHeight / 2,
      50,
      matterContainer.clientHeight,
      {
        isStatic: true,
        render: { fillStyle: "red" },
      }
    );

    let rightWall = Bodies.rectangle(
      matterContainer.clientWidth + 25,
      matterContainer.clientHeight / 2,
      50,
      matterContainer.clientHeight,
      {
        isStatic: true,
        render: { fillStyle: "red" },
      }
    );

    walls.push(ground, ceiling, leftWall, rightWall);
    Composite.add(world, walls);
  }

  createWalls();

  // Enable mouse interaction
  var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

  Composite.add(world, mouseConstraint);
  render.mouse = mouse;

  function drawText() {
    var context = render.context;
    context.font = "18px clashDisplay";
    context.fillStyle = "#16181D";
    context.textAlign = "center";
    context.textBaseline = "middle";

    buttons.forEach((button) => {
      var position = button.position;
      var angle = button.angle;

      context.save();
      context.translate(position.x, position.y);
      context.rotate(angle);
      context.fillText(button.label, 0, 0);
      context.restore();
    });
  }

  Events.on(render, "afterRender", function () {
    drawText();
  });

  function resizeCanvas() {
    viewport = getViewportSize();
    render.canvas.width = viewport.width;
    render.canvas.height = viewport.height;

    render.options.width = viewport.width;
    render.options.height = viewport.height;

    createWalls();
    createButtons();
  }

  window.addEventListener("resize", resizeCanvas);

  return {
    engine: engine,
    runner: runner,
    render: render,
    canvas: render.canvas,
    stop: function () {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
    },
  };
};

Example.fallingButtons();
