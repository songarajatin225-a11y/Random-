/* ============================================================
   EDIT EVERYTHING HERE.
   This is the only file you need to touch to personalise the
   site: names, messages, photos, captions, letter and music.
   ============================================================ */

export const siteConfig = {
  sisterName: "Sister",
  brotherName: "Your Brother",

  /* --- Hero: the first thing she sees --- */
  hero: {
    eyebrow: "Raksha Bandhan",
    line1: "For My Dearest Sister",
    line2: "I made something special for you...",
    line3: "Happy Raksha Bandhan!",
    cta: "Open Your Surprise",
    scrollHint: "Scroll through our memories",
  },

  /* --- Section: Our Bond --- */
  bond: {
    eyebrow: "Our Bond",
    heading: "Some Bonds Don't Need an Explanation",
    paragraphs: [
      "Life changes, responsibilities grow, and everything around us keeps moving.",
      "But some relationships simply remain special.",
      "You're not just my sister — you're someone I'll always care about, support, laugh with, argue with, and annoy forever. ❤️",
    ],
  },

  /* --- Section: Memory Gallery ---
     Drop your photos into  public/images/  and point `image` at them.
     Anything missing shows an elegant placeholder instead — nothing breaks.
     `span` controls the tile size on desktop: "tall" | "wide" | "regular".
  */
  memories: [
    {
      image: "/images/sister1.jpg",
      title: "A moment worth remembering",
      caption: "Some moments are simply priceless.",
      span: "tall",
    },
    {
      image: "/images/sister2.jpg",
      title: "Always a good time",
      caption: "Wouldn't trade these for anything.",
      span: "regular",
    },
    {
      image: "/images/memory1.jpg",
      title: "Unplanned and perfect",
      caption: "My favourite person to annoy.",
      span: "regular",
    },
    {
      image: "/images/memory2.jpg",
      title: "That one laugh",
      caption: "Still not sure what was so funny.",
      span: "wide",
    },
    {
      image: "/images/memory3.jpg",
      title: "Just us",
      caption: "Forever my sister, always my person.",
      span: "regular",
    },
    {
      image: "/images/family.jpg",
      title: "Everyone in one frame",
      caption: "Rare, and worth it every time.",
      span: "regular",
    },
    {
      image: "/images/rakhi.jpg",
      title: "A thread that says a lot",
      caption: "One knot, a whole promise.",
      span: "tall",
    },
    {
      image: "/images/photo1.jpg",
      title: "Somewhere, sometime",
      caption: "Always a good time with you.",
      span: "regular",
    },
    {
      image: "/images/photo2.jpg",
      title: "Caught mid-sentence",
      caption: "You never let me finish. ❤️",
      span: "regular",
    },
    {
      image: "/images/photo3.jpg",
      title: "To be continued",
      caption: "More memories to come...",
      span: "wide",
    },
  ],

  /* --- Section: Things I don't say enough --- */
  appreciation: {
    eyebrow: "For You",
    heading: "Things I Probably Don't Say Enough...",
    lines: [
      "Thank you for always being there.",
      "Thank you for believing in me.",
      "Thank you for all the little things.",
      "Thank you for making life a little better.",
      "And most importantly...",
    ],
    finale: "Thank you for being my sister. ❤️",
  },

  /* --- Section: Because we're still us --- */
  siblingMoments: {
    eyebrow: "Still Us",
    heading: "Because We're Still Us 😂",
    cards: [
      { label: "Fighting", text: "Who started it?", glyph: "⚔" },
      { label: "Food", text: "Your food somehow becomes our food.", glyph: "◕" },
      { label: "Secrets", text: "Some things are better left between siblings.", glyph: "❦" },
      { label: "Annoying Each Other", text: "It's basically part of the job description.", glyph: "✺" },
      { label: "Support", text: "But when it matters, we've always got each other.", glyph: "❤" },
    ],
  },

  /* --- Section: If I could give you one thing --- */
  oneThing: {
    intro: "If I could give you one thing this Raksha Bandhan...",
    reveal: "It would be the ability to see yourself through my eyes.",
    outro: "You'd realise how special you really are. ❤️",
  },

  /* --- Section: Rakhi interaction --- */
  rakhi: {
    eyebrow: "The Rakhi",
    heading: "A Little Rakhi Moment ❤️",
    subheading: "One tap. One thread. One promise.",
    button: "Tie the Rakhi",
    messages: [
      "No matter where life takes us...",
      "...you'll always have me by your side.",
    ],
    finale: "Happy Raksha Bandhan, Sis! ❤️",
    replay: "Tie it again",
  },

  /* --- Section: The letter --- */
  letter: {
    eyebrow: "In My Words",
    heading: "A Little Note For You",
    salutation: "Dear Sis,",
    body: [
      "We may argue, annoy each other, laugh at the most random things, and sometimes drive each other crazy...",
      "But behind all of that is something that will never change — you're one of the most important people in my life.",
      "I hope you always know that you have someone who will stand beside you, support you, cheer for you, and annoy you whenever necessary.",
      "I'm genuinely lucky to call you my sister.",
    ],
    closing: "Happy Raksha Bandhan ❤️",
    signature: "Always your brother.",
  },

  /* --- Section: Final surprise --- */
  finalSurprise: {
    eyebrow: "One Last Thing...",
    teaser: "I saved the best bit for the end.",
    button: "Click Me ❤️",
    finalMessage: "Happy Raksha Bandhan, Sis! ❤️",
    loveLine: "Love you always.",
    signOff: "— Your annoying but favourite brother 😄",
    /* Photos for the closing montage. Uses the gallery photos by default. */
    montage: [
      "/images/sister1.jpg",
      "/images/memory2.jpg",
      "/images/photo1.jpg",
      "/images/rakhi.jpg",
    ],
  },

  /* --- Optional background music ---
     Drop an mp3 at public/music/raksha-bandhan.mp3.
     If the file isn't there, the button quietly hides itself.
  */
  music: {
    path: "/music/raksha-bandhan.mp3",
    label: "Background music",
    volume: 0.35,
  },
};

/* Navigation — ids must match the <section id="..."> in App.jsx */
export const navLinks = [
  { id: "home", label: "Home" },
  { id: "bond", label: "Our Bond" },
  { id: "memories", label: "Memories" },
  { id: "for-you", label: "For You" },
  { id: "rakhi", label: "Rakhi" },
  { id: "letter", label: "Letter" },
];

export default siteConfig;
