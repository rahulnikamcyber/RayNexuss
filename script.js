document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".counter");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.getAttribute("data-target");
        let count = 0;

        const update = () => {
          const speed = 20;
          if (count < target) {
            count += Math.ceil(target / speed);
            el.innerText = count > target ? target : count;
            setTimeout(update, 30);
          }
        };
        update();
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 1.0
  });

  counters.forEach(counter => observer.observe(counter));
});
