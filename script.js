// Example selections only: these buttons never authorize third-party accounts.
document.querySelectorAll('.tool').forEach(tool => tool.addEventListener('click', () => {
  const selected = tool.classList.toggle('selected');
  tool.setAttribute('aria-pressed', String(selected));
  document.querySelector('[data-count]').textContent = document.querySelectorAll('.tool.selected').length;
}));

// Content remains visible even when JavaScript is unavailable.

// These are editorial examples, never responses from a connected agent.
const workflows = {
  "restaurant": {
    "title": "A week of marketing.",
    "brief": "Create a week of marketing for our lunch offer.",
    "steps": [
      "Set the offer",
      "Draft the campaign",
      "Your team reviews",
      "After approval"
    ],
    "outputs": [
      [
        "Example brief",
        "Start with the essentials.",
        "One offer. Clear guidelines. A named reviewer.",
        [
          "Lunch offer and menu",
          "Brand assets and channels",
          "Review owner"
        ],
        "Your brief sets the direction."
      ],
      [
        "Campaign draft",
        "Lunch, promoted.",
        "Copy and a visual brief, ready for review.",
        [
          "Social: “A better lunch break starts here.”",
          "Email: “Your weekday lunch, sorted.”",
          "Visual: approved dish photo and offer"
        ],
        ""
      ],
      [
        "Approval checklist",
        "Your team reviews.",
        "Check the details before anything goes out.",
        [
          "Offer details and dates",
          "Brand voice and visuals",
          "Approve or request changes"
        ],
        "Publishing stays in your control."
      ],
      [
        "Delivery plan",
        "Ready for the next step.",
        "Scheduling follows your approval and agreed integrations.",
        [
          "Approved content by channel",
          "Publishing slots",
          "Next offer and reviewer"
        ],
        "A plan, not a publishing action."
      ]
    ]
  },
  "research": {
    "title": "A clearer market view.",
    "brief": "Compare local competitors. Build a sourced research brief.",
    "steps": [
      "Set the question",
      "Find the signals",
      "Review the evidence",
      "Share the brief"
    ],
    "outputs": [
      [
        "Example brief",
        "Ask the right question.",
        "Define the market and the evidence you need.",
        [
          "Competitor shortlist",
          "Research questions",
          "Source requirements"
        ],
        "A focused starting point."
      ],
      [
        "Research outline",
        "Signals, brought together.",
        "Organize permitted public information for comparison.",
        [
          "Offers and positioning",
          "Customer themes",
          "Sources and open questions"
        ],
        "Evidence before conclusions."
      ],
      [
        "Evidence checklist",
        "Review what supports it.",
        "Separate facts, interpretations, and unknowns.",
        [
          "Check material claims",
          "Flag conflicting findings",
          "Review the opportunities"
        ],
        "Your judgment leads."
      ],
      [
        "Research handoff",
        "A brief worth discussing.",
        "Findings and sources in your team’s preferred format.",
        [
          "Source-linked summary",
          "Themes and hypotheses",
          "Questions to explore"
        ],
        "Illustrative, not live research."
      ]
    ]
  },
  "content": {
    "title": "One idea. More reach.",
    "brief": "Turn our product update into a week of content.",
    "steps": [
      "Set the message",
      "Create the drafts",
      "Review the content",
      "Plan the handoff"
    ],
    "outputs": [
      [
        "Example brief",
        "Start with your message.",
        "Set the facts, voice, and audience.",
        [
          "Approved update",
          "Brand voice",
          "Channels and reviewer"
        ],
        "Your information comes first."
      ],
      [
        "Content draft",
        "One message. Every channel.",
        "Adapt the update without losing your voice.",
        [
          "Social post",
          "Email introduction",
          "Content calendar"
        ],
        "Drafts for your team."
      ],
      [
        "Editorial checklist",
        "Review before it goes out.",
        "Check accuracy, voice, and format.",
        [
          "Product facts",
          "Tone and links",
          "Approve or revise"
        ],
        "Your team has the final say."
      ],
      [
        "Content handoff",
        "Organized. Ready for next steps.",
        "Fit approved content into your publishing process.",
        [
          "Copy by channel",
          "Assets and owners",
          "Dates and status"
        ],
        "Publishing follows your agreed workflow."
      ]
    ]
  }
};

const scenarioTabs = Array.from(document.querySelectorAll('[data-scenario]'));
const stageButtons = Array.from(document.querySelectorAll('[data-stage]'));
const panel = document.querySelector('#workflow-panel');
const output = document.querySelector('.sample-output');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let currentScenario = 'restaurant';
let outputAnimation;
let currentStage = 0;
let tourTimer;
let tourPlaying = false;
const tour = document.querySelector('[data-tour]');
const tourLabel = document.querySelector('[data-tour-label]');

function stopTour() {
  clearTimeout(tourTimer);
  tourPlaying = false;
  tourLabel.textContent = 'Watch the workflow';
  tour.querySelector('.tour-icon').textContent = '▶';
}

function renderStage(index, animate = true) {
  currentStage = index;
  const values = workflows[currentScenario].outputs[index];
  stageButtons.forEach((button, position) => {
    button.setAttribute('aria-pressed', String(position === index));
    button.classList.toggle('is-complete', position < index);
  });
  panel.style.setProperty('--flow-progress', String(index / 3));
  panel.dataset.activeStage = String(index);
  document.querySelector('[data-flow-status]').textContent = ['Start with a clear brief', 'Drafts prepared for review', 'Ready for your review', 'Delivery planned after approval'][index];
  document.querySelector('[data-stage-count]').textContent = `Step ${index + 1} of 4`;
  ['kind', 'title', 'copy'].forEach((name, position) => {
    document.querySelector(`[data-output-${name}]`).textContent = values[position];
  });
  document.querySelector('[data-output-items]').replaceChildren(...values[3].map(text => {
    const item = document.createElement('li');
    item.textContent = text;
    return item;
  }));
  const outputFooter = document.querySelector('[data-output-footer]');
  outputFooter.textContent = values[4];
  outputFooter.parentElement.hidden = !values[4];
  if (outputAnimation) outputAnimation.cancel();
  if (animate && !reducedMotion.matches) {
    outputAnimation = output.animate([{ opacity: .4, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 220, easing: 'ease-out' });
  }
}

function selectScenario(tab) {
  stopTour();
  currentScenario = tab.dataset.scenario;
  const workflow = workflows[currentScenario];
  const stageNames = currentScenario === 'research' ? ['Brief', 'Research', 'Review', 'Delivery plan'] : ['Brief', 'Create', 'Review', 'Delivery plan'];
  scenarioTabs.forEach(item => {
    item.setAttribute('aria-selected', String(item === tab));
    item.tabIndex = item === tab ? 0 : -1;
  });
  panel.setAttribute('aria-labelledby', tab.id);
  panel.dataset.scenarioView = currentScenario;
  document.querySelector('[data-scenario-title]').textContent = workflow.title;
  document.querySelector('[data-brief]').textContent = workflow.brief;
  stageButtons.forEach((button, index) => {
    button.querySelector('b').textContent = stageNames[index];
    button.querySelector('small').textContent = workflow.steps[index];
  });
  renderStage(0);
}

scenarioTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectScenario(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % scenarioTabs.length;
    else if (event.key === 'ArrowLeft') next = (index + scenarioTabs.length - 1) % scenarioTabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = scenarioTabs.length - 1;
    else return;
    event.preventDefault();
    selectScenario(scenarioTabs[next]);
    scenarioTabs[next].focus();
  });
});
stageButtons.forEach((button, index) => button.addEventListener('click', () => {
  stopTour();
  renderStage(index);
}));

function advanceTour() {
  renderStage(currentStage + 1);
  if (currentStage === 2) {
    stopTour();
    tourLabel.textContent = 'Replay workflow';
    return;
  }
  tourTimer = setTimeout(advanceTour, 1500);
}

tour.addEventListener('click', () => {
  if (tourPlaying) {
    stopTour();
    return;
  }
  if (reducedMotion.matches) {
    renderStage(2, false);
    tourLabel.textContent = 'Replay workflow';
    return;
  }
  renderStage(0);
  tourPlaying = true;
  tourLabel.textContent = 'Pause workflow';
  tour.querySelector('.tour-icon').textContent = 'Ⅱ';
  tourTimer = setTimeout(advanceTour, 1500);
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopTour();
});
reducedMotion.addEventListener('change', () => {
  if (tourPlaying && reducedMotion.matches) {
    stopTour();
    renderStage(2, false);
  }
});
renderStage(1, false);
