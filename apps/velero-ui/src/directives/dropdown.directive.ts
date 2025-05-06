export const dropdown = {
  mounted: (el, binding) => {
    el.hidden = true;
    el.targetElement = document.getElementById(binding.value);

    el.clickDropdownButton = (event) => {
      if (!(el == event.target || el.contains(event.target))) {
        el.hidden = true;
        if (!el.targetElement.classList.contains('hidden')) {
          el.targetElement.classList.add('hidden');
        }
      } else if (
        el == event.target ||
        (el.contains(event.target) && !el.contains(el.targetElement))
      ) {
        el.hidden = !el.hidden;
        if (el.hidden) {
          el.targetElement.classList.add('hidden');
        } else {
          el.targetElement.classList.remove('hidden');
        }
      }
    };
    document.addEventListener('click', el.clickDropdownButton);
  },
  unmounted: (el) => {
    document.removeEventListener('click', el.clickDropdownButton);
  },
};
