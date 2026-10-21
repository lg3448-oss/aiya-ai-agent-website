const missions = {
  launch: { prompt: 'Build a launch plan for our new product across search, social, and email.', status: 'Building your launch system', outputs: [['Market signal brief','Research · complete'],['Channel plan','Strategy · complete'],['Campaign concepts','Creative · drafting']] },
  market: { prompt: 'Map our market, identify the white space, and show us where to compete.', status: 'Mapping your competitive landscape', outputs: [['Competitor map','Research · complete'],['Opportunity spaces','Analysis · complete'],['Positioning brief','Strategy · drafting']] },
  content: { prompt: 'Turn this week’s customer signals into a focused month of content.', status: 'Creating your content system', outputs: [['Signal summary','Research · complete'],['Editorial calendar','Planning · complete'],['Draft content','Creative · drafting']] }
};

document.querySelectorAll('[data-mission]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-mission]').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const mission = missions[button.dataset.mission];
  document.querySelector('[data-prompt]').textContent = mission.prompt;
  document.querySelector('[data-status]').textContent = mission.status;
  document.querySelector('[data-output]').innerHTML = mission.outputs.map((item, index) => `<article><span>0${index + 1}</span><b>${item[0]}</b><small>${item[1]}</small></article>`).join('');
}));

document.querySelectorAll('.tool').forEach(tool => tool.addEventListener('click', () => {
  tool.classList.toggle('selected');
  document.querySelector('[data-count]').textContent = document.querySelectorAll('.tool.selected').length;
}));

const menu = document.querySelector('[data-menu]');
menu.addEventListener('click', () => {
  const open = document.querySelector('[data-nav-links]').classList.toggle('open');
  menu.setAttribute('aria-expanded', open);
});
document.querySelectorAll('[data-nav-links] a').forEach(link => link.addEventListener('click', () => document.querySelector('[data-nav-links]').classList.remove('open')));

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
