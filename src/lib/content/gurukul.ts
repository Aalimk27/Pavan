import type { GurukulTopic } from "./types";

/**
 * GURUKUL: structured life education built from the Gita, Katha and practical dharmic living.
 *
 * Each topic offers three short lessons, a gentle seven-day practice (each day about 15 minutes or less),
 * three journaling questions, and links to related Gita verses and Katha stories.
 *
 * Tone (blueprint): guidance without fear; the reader keeps their agency; devotional practice is
 * offered as devotion, never as a scientific claim or a substitute for medical or mental-health care.
 * Gita quotations follow the wording in ./gita.ts. Story references stay close to their sources and
 * name later or folk tradition where that is where a story comes from.
 */

export const GURUKUL: GurukulTopic[] = [
  {
    slug: "anger",
    title: "Anger",
    sanskrit: "क्रोध",
    sanskritRoman: "Krodha",
    tagline: "Anger is energy. You decide what it builds.",
    overview:
      "Anger is a natural signal that something matters to you, but left unexamined it clouds judgement and hurts the people we love. The Gita traces anger back to its root in blocked desire and shows how to catch it early. This course helps you feel anger honestly, pause before acting, and turn its heat into clear, kind action.",
    lessons: [
      {
        title: "Trace the chain back to its start",
        body: [
          "The Gita maps anger with striking precision. Dwelling on something creates attachment, attachment grows into desire, and from desire, especially when it is blocked, anger arises (2.62). From anger comes delusion; delusion clouds memory, so we forget what we know; and when memory fails, good judgement is lost (2.63).",
          "This is good news, because a chain has links you can interrupt. Much of our anger is a 'should' that was not met: they should have listened, it should have gone my way. Naming the blocked expectation, quietly and honestly, often loosens anger's grip before it reaches your words.",
        ],
      },
      {
        title: "Pause before you speak",
        body: [
          "Anger is fast; wisdom needs a few seconds. A slow breath, a sip of water or stepping out of the room is not weakness. It is the space in which you choose your response instead of being chosen by it.",
          "The Gita calls speech that is truthful, pleasant, beneficial and causes no distress the tapas, or disciplined practice, of speech (17.15). You can still say the hard thing. Say it once the heat has settled, aimed at the problem rather than the person.",
        ],
      },
      {
        title: "Let anger point to what needs care",
        body: [
          "Under anger there is often hurt, fear, tiredness or a boundary that has been crossed. Ask what your anger is protecting. Sometimes the answer calls for a calm conversation, sometimes rest, and sometimes forgiveness, which the Gita counts among the qualities of one dear to the Divine (12.13).",
          "In a well-loved story about the Marathi saint Tukaram, he answers a moment of anger at home not with anger but with gentle humour. Few of us begin there, and that is fine. Every pause you choose makes the next one a little easier.",
          "If anger feels constant, frightening or out of your control, or if anyone is being hurt, please reach out to a qualified counsellor or doctor, and if anyone is in immediate danger, contact local emergency services. Spiritual practice complements that care; it does not replace it.",
        ],
      },
    ],
    practice: [
      "Each time irritation rises today, jot down the time and the trigger in a word or two. No judging, only noticing.",
      "Look at yesterday's notes and, beside each one, write the 'should' — the expectation that was not met.",
      "When anger rises, take three slow breaths, longer on the out-breath, before you say anything.",
      "Before one difficult message or conversation, ask whether your words are true, kind and helpful (Gita 17.15), and soften one sentence.",
      "When you feel tense, take a brisk ten-minute walk or stretch, letting the body release what the mind is holding.",
      "Write for ten minutes about one recent flash of anger and the hurt, fear or tiredness that may have been underneath it.",
      "Send a short, sincere message to repair one strained moment, or quietly forgive one person in prayer or in a note you keep to yourself.",
    ],
    reflection: [
      "Which situations or unmet 'shoulds' most often trigger my anger, and what do they have in common?",
      "When I am angry, what am I usually trying to protect?",
      "Who has felt the edge of my anger recently, and what would a calm, honest repair look like?",
    ],
    gita: ["2.62", "2.63", "17.15", "12.13"],
    katha: ["tukaram-and-the-sugarcane"],
  },
  {
    slug: "ego",
    title: "Ego",
    sanskrit: "अहङ्कार",
    sanskritRoman: "Ahaṅkāra",
    tagline: "Quiet confidence, free from the weight of pride.",
    overview:
      "Ahaṅkāra literally means the 'I-maker': the sense that 'I alone am the doer'. A healthy sense of self helps you act, but an inflated ego turns every comment into a threat and every success into a trophy. The Gita teaches a quieter confidence that knows its gifts and remembers where they came from.",
    lessons: [
      {
        title: "You are not the only doer",
        body: [
          "The Gita observes that actions unfold through the many forces of nature (the gunas), yet the mind clouded by ego insists, 'I am the doer' (3.27). Look closely at any achievement and you will find teachers, family, health, timing, opportunity and the work of countless people you never met.",
          "Seeing this does not make you smaller. It frees you from carrying the whole world on your shoulders, and it naturally turns pride into gratitude.",
        ],
      },
      {
        title: "Humility is accuracy",
        body: [
          "Humility is not thinking less of yourself; it is seeing yourself truthfully, strengths and limits together. The Gita says the wise see with an equal eye a learned and humble brahmin (a priest-scholar), a cow, an elephant, a dog and an outcaste (5.18). Status changes how people are treated, not what they are.",
          "In practice, humility sounds like 'I was wrong', 'I don't know yet' and 'Thank you, you taught me something.' Each of these sentences costs the ego a little and gives your relationships a great deal.",
        ],
      },
      {
        title: "When pride meets a mountain",
        body: [
          "In the Bhagavata Purana, Indra, proud of his position, sends storms to punish the people of Vraja for turning their worship elsewhere. Krishna lifts Govardhan hill and shelters everyone beneath it, and Indra later comes to him humbled. Pride tried to prove its power; love simply protected people.",
          "Notice where your own ego needs to win, to be right or to be seen. The Gita's ideal is one who is 'free from possessiveness and ego' (12.13): not someone without a self, but someone whose self no longer stands in the way.",
        ],
      },
    ],
    practice: [
      "Write down one thing you are proud of, then list every person and circumstance that helped make it possible.",
      "In one conversation today, listen fully without steering the topic back to yourself.",
      "Say 'I was wrong' or 'I don't know' once today, plainly and without excuses.",
      "Do one useful task quietly — wash the dishes, fix a small problem — and tell no one.",
      "Ask someone you trust for honest feedback on one area of your life, and thank them, whatever they say.",
      "Notice one moment when you want to win an argument; let it go and ask a curious question instead.",
      "End the day by offering your efforts in prayer or quiet thanks: 'This was done through me, not by me alone.'",
    ],
    reflection: [
      "Where in my life do I most need to be seen as right, important or successful?",
      "Which of my achievements would not exist without the help of others?",
      "How would my closest relationships change if I let go of needing to win?",
    ],
    gita: ["3.27", "5.18", "12.13"],
    katha: ["govardhan-and-indras-pride"],
  },
  {
    slug: "comparison",
    title: "Comparison",
    sanskrit: "तुलना",
    sanskritRoman: "Tulanā",
    tagline: "Walk your own path, at your own pace.",
    overview:
      "Comparison is as old as humanity, but endless scrolling has made it constant. Measuring your life against someone else's highlights steals joy and blurs your own direction. The Gita offers a steadier measure: your own dharma, walked sincerely, is worth more than another's walked perfectly.",
    lessons: [
      {
        title: "Your path, imperfect and yours",
        body: [
          "'Better is one's own dharma, though imperfectly performed, than the dharma of another well performed' (3.35). Svadharma, your own path, is shaped by your nature, your circumstances and your responsibilities. No one else has exactly that combination, so no one else is the right yardstick.",
          "When you imitate someone else's life, you take on their pressures without their gifts. The same verse calls another's path 'fraught with fear'. One practical reading: living someone else's script means always worrying that you will fall short of it.",
        ],
      },
      {
        title: "From wound to resolve",
        body: [
          "As a young child, Dhruva was turned away from his father's lap while his half-brother was welcomed. The pain of that moment sent him into deep, determined prayer. In the Bhagavata Purana's telling, when he finally received the vision of the Divine, his old wish for a position higher than anyone's felt small beside what he had found.",
          "Comparison often points at something real: a hurt, a longing, or a talent waiting to grow. Ask what the feeling is showing you, then turn its energy toward your own growth rather than anyone else's downfall.",
        ],
      },
      {
        title: "The ocean that stays full",
        body: [
          "The Gita describes a person at peace as an ocean: rivers pour into it endlessly, yet it stays still within its shores (2.70). A content person is not without wants; they are simply not tossed about by everything they see others enjoying.",
          "Envy loosens when you celebrate others sincerely. The Gita counts freedom from envy among the qualities of one dear to the Divine (12.15). Rejoicing in someone else's good fortune is a quiet discipline, and it makes room for your own.",
        ],
      },
    ],
    practice: [
      "Each time you compare yourself to someone today, make a small mark on paper. Just count; don't judge.",
      "Mute or unfollow three accounts that regularly leave you feeling 'less than'.",
      "Write three ways you have grown in the past year, measured only against your own past self.",
      "Congratulate someone sincerely on a success you quietly envy, in a message or in person.",
      "Describe your own svadharma in five honest lines: your responsibilities, your gifts and what you care about.",
      "Spend ten minutes on one small step toward a goal that is genuinely yours, not borrowed from someone else.",
      "Before sleep, name three things in your own life you would not trade, and give thanks for them.",
    ],
    reflection: [
      "Whose life do I compare myself to most, and what am I really longing for when I do?",
      "If no one could see my life, what would I still choose to do?",
      "What does success look like when I measure it by my own dharma rather than someone else's?",
    ],
    gita: ["3.35", "2.70", "12.15"],
    katha: ["dhruva-unshakeable-resolve"],
  },
  {
    slug: "desire",
    title: "Desire",
    sanskrit: "काम",
    sanskritRoman: "Kāma",
    tagline: "Want wisely. Choose the good over the merely pleasant.",
    overview:
      "Desire moves the world, and in dharmic thought kāma, rightful enjoyment, is one of the legitimate aims of life when it rests on dharma. Trouble begins when desire runs us instead of serving us. This course helps you tell lasting good from passing pleasure, and enjoy life without being ruled by it.",
    lessons: [
      {
        title: "How a passing thought becomes a pull",
        body: [
          "The Gita traces the journey: dwelling on an object breeds attachment, attachment grows into desire, and blocked desire turns to anger (2.62). Most cravings begin as a thought we keep returning to: one more look, one more scroll, one more 'what if'.",
          "You don't have to fight every desire head-on. Simply notice where your attention keeps going. What you water grows, so give your attention to what you truly want to grow.",
        ],
      },
      {
        title: "The good and the pleasant",
        body: [
          "In the Katha Upanishad, young Nachiketa is offered wealth, long life and every pleasure by Yama, the lord of death. He declines them all, saying that wealth can never truly satisfy a person, and asks instead to understand what lies beyond death. The Upanishad names the choice before every human being: shreyas, the good, and preyas, the merely pleasant.",
          "Daily life offers the same fork in small ways: rest or one more screen, the honest word or the easy one, the meal that nourishes or the one that numbs. Choosing the good is not joyless; it is choosing a deeper kind of joy.",
        ],
      },
      {
        title: "Fullness, not emptiness",
        body: [
          "The Gita's image of peace is an ocean that receives every river and stays steady; peace comes to such a person, the verse says, not to the one who chases desires (2.70). The image does not ask you to pretend desires never arise. It shows a mind so full and grounded that desires can come and go without capsizing it.",
          "The person of steady wisdom, the Gita says, has no craving for pleasures and is free from attachment, fear and anger (2.56). That steadiness grows from small, repeated choices: waiting a day before buying, enjoying one thing fully instead of many things distractedly, and receiving life's pleasures with gratitude.",
        ],
      },
    ],
    practice: [
      "List three things you have been craving lately. Beside each, write what you hope it will give you.",
      "Postpone one non-essential purchase or treat by a day, and notice tomorrow whether you still want it.",
      "Make one small 'good over pleasant' choice today: an earlier night, a walk instead of a scroll, water instead of another sweet drink.",
      "Eat one meal slowly and without a screen, savouring each taste: enjoyment with full attention.",
      "Read the story of Nachiketa and write down the one lasting 'boon' you would ask for if you could ask for anything.",
      "Give away or donate one thing you no longer need, and notice the lightness it leaves.",
      "Before a meal or before sleep, offer your enjoyments in a short prayer of thanks, holding them lightly.",
    ],
    reflection: [
      "Which of my desires truly serve my wellbeing, and which simply keep me busy?",
      "Where am I choosing the pleasant over the good, again and again?",
      "If I already had enough, what would I spend my time and energy on?",
    ],
    gita: ["2.62", "2.70", "2.56"],
    katha: ["nachiketa-three-boons"],
  },
  {
    slug: "duty",
    title: "Duty",
    sanskrit: "स्वधर्म",
    sanskritRoman: "Svadharma",
    tagline: "Do what is yours to do, fully, and let go of the fruit.",
    overview:
      "Svadharma is your own duty: the responsibilities that belong to your role, your nature and this season of your life. The Gita's central teaching is to do that work wholeheartedly while letting go of anxiety about results. Duty then stops feeling like a burden and becomes a steady source of meaning.",
    lessons: [
      {
        title: "The effort is yours; the fruit is not yours to hold",
        body: [
          "'Your right is to action alone, never to its fruits' (2.47) is perhaps the most quoted line of the Gita. It does not mean careless work or ignoring consequences. It means you put your full care into the effort, which is yours, and stop making results your motive, since they depend on many things you don't control. The same verse adds a balancing warning: do not be attached to inaction either.",
          "This one shift lowers anxiety and raises the quality of your work. The student who studies for the love of learning, the parent who cares without keeping score, the professional who does the job well even when no one is watching: each is living this verse.",
        ],
      },
      {
        title: "Action is better than avoidance",
        body: [
          "When duty feels heavy, it is tempting to freeze, delay or escape. The Gita is gentle but clear: 'action is better than inaction' (3.8). Even keeping the body alive takes action; so does keeping a family, a team or a life in good order.",
          "Begin with the smallest next step. Duty is rarely one heroic deed. It is usually the email answered, the bill paid, the parent called, the promise kept.",
        ],
      },
      {
        title: "Dharma under pressure",
        body: [
          "In the Mahabharata, four of the Pandava brothers drink from a lake without answering the questions of its guardian, a yaksha, and fall lifeless. Yudhishthira pauses and answers every question with patience. Offered the life of just one brother, he chooses Nakula, son of his stepmother Madri, so that both of his father's wives would have a living son.",
          "Fairness, not self-interest, guided that choice. Duty sometimes asks us to pause before we grab, and to choose what is right over what is convenient. Your own dharma, even done imperfectly, is your true path (3.35).",
        ],
      },
    ],
    practice: [
      "Write down your main roles — child, parent, partner, friend, worker, citizen — and one duty that belongs to each.",
      "Work on the task you have been avoiding most for just ten minutes. Starting is the practice.",
      "Choose one piece of work today and do it as well as you can, without thinking about how it will be judged.",
      "Keep one small promise you made and may have forgotten.",
      "Before a task, pause for one breath and say inwardly: 'I give my best; the result is not mine to hold.'",
      "Take care of one thing that is genuinely your responsibility before anyone has to ask.",
      "Review your week in three lines: where did you act from duty with a light heart, and where from pressure?",
    ],
    reflection: [
      "What is truly mine to do in this season of my life, and what am I carrying that isn't mine?",
      "Which result am I most anxious about, and which part of it is actually in my hands?",
      "Where am I choosing convenience over what I know is right?",
    ],
    gita: ["2.47", "3.8", "3.35"],
    katha: ["yudhishthira-and-the-yaksha"],
  },
  {
    slug: "fear",
    title: "Fear",
    sanskrit: "भय",
    sanskritRoman: "Bhaya",
    tagline: "Remember your strength. You are larger than your fear.",
    overview:
      "Fear protects us from real danger, but it also tells stories about dangers that never come. The Gita names fearlessness (abhaya) first in its list of divine qualities and offers a steady perspective: hard experiences come and go, and something in you is not touched by them. This course helps you meet fear with courage, practical steps and, if it is part of your path, trust in the Divine.",
    lessons: [
      {
        title: "Feelings come and go",
        body: [
          "'The contact of the senses with their objects gives rise to cold and heat, pleasure and pain. They come and go; they do not last. Bear them patiently' (2.14). Fear can be intense, but it is a passing wave, not a permanent state.",
          "Courage is not the absence of fear; it is taking one wise step while fear is still present. Simply naming it — 'I notice I'm afraid of…' — already creates a little space between you and the feeling.",
        ],
      },
      {
        title: "Remember who you are",
        body: [
          "In the Ramayana, as the search party stands at the ocean's edge wondering who can leap across to Lanka, Hanuman sits apart in silence. The wise elder Jambavan reminds him of his origins and his strength, and Hanuman rises to the task. Sometimes we do not lack strength; we have only forgotten it.",
          "The Gita offers the deepest reminder of all: the Self is never born and never dies (2.20). Whatever changes around you, something essential in you remains whole. Keep people close who remind you of your strength, and be that reminder for others.",
          "Fear of what others think can be just as strong. The poet-saint Mirabai, pressed again and again to give up her devotion, kept singing for Krishna, kindly but without apology. Remembering what you love most can steady you as much as remembering your strength.",
        ],
      },
      {
        title: "Effort and surrender together",
        body: [
          "In the Bhagavata Purana, Gajendra, king of the elephants, struggles for a long time against a crocodile that has seized his leg. When his own strength is spent, he turns to the Supreme in heartfelt prayer and is set free. The story does not ask us to give up effort; it shows that after our best effort, we can rest in something larger. Near the end of the Gita, Krishna assures Arjuna: 'take refuge in Me… do not grieve' (18.66).",
          "Many devotees find that a few minutes of prayer, or softly repeating a divine name such as Radha or Rama, settles the heart. Offer it as devotion, alongside practical steps.",
          "If fear or anxiety is persistent, overwhelming or getting in the way of daily life, please reach out to a doctor or a qualified mental-health professional. Spiritual practice complements that care; it does not replace it.",
        ],
      },
    ],
    practice: [
      "Write down one fear that has been on your mind. Beside it, write what is actually within your control.",
      "When fear rises, breathe slowly and comfortably for five minutes: in for a count of four, out for a count of six.",
      "Take one small, safe step toward something you have been avoiding out of fear.",
      "Call or message someone who believes in you and tell them honestly what you are facing.",
      "Read Gita 2.14 slowly three times, then write about one thing that once frightened you and has since passed.",
      "If it is part of your devotion, spend ten minutes in prayer or gentle naam jap (repeating a divine name, such as Radha or Rama); otherwise, sit quietly with your breath.",
      "List three times you were braver than you expected, and keep the list where you can see it.",
    ],
    reflection: [
      "What is my fear trying to protect, and is that danger real right now or imagined?",
      "When have I faced something hard and come through it, and what helped me then?",
      "What would I do this week if I trusted that I could handle whatever comes?",
    ],
    gita: ["2.14", "2.20", "16.1", "18.66"],
    katha: ["hanuman-remembers-his-strength", "gajendra-moksha", "meera-sings-without-fear"],
  },
  {
    slug: "money",
    title: "Money",
    sanskrit: "अर्थ",
    sanskritRoman: "Artha",
    tagline: "Earn honestly, spend wisely, give gladly.",
    overview:
      "In dharmic thought, artha, wealth and material security, is one of the four rightful aims of life, alongside dharma, kāma and moksha. Money is not unspiritual; it becomes a problem only when it is earned without integrity or held without generosity. This course offers a calm, practical approach to earning, spending, saving and giving.",
    lessons: [
      {
        title: "Wealth that rests on dharma",
        body: [
          "Traditional wisdom places dharma first among the aims of life so that artha can rest on it, like a house on its foundation. Wealth earned honestly brings a peace that shortcut money never can.",
          "The Gita's call to action applies here too: 'action is better than inaction' (3.8). Honest effort, growing skill and fair dealing are themselves a form of offering.",
        ],
      },
      {
        title: "Enough is a decision",
        body: [
          "In a popular folk tale, Kubera, the god of wealth, hosts a lavish feast to show off his riches. Young Ganesha eats everything and is still hungry, and is satisfied only by a simple handful of food offered with humility. The story is a gentle reminder that display can never fill what only contentment and love can.",
          "Decide what 'enough' looks like for your needs, your savings and your goals. Without that line, every rise in income simply moves the finish line further away. A simple plan — what comes in, what goes out, what is saved and what is given — brings real calm.",
        ],
      },
      {
        title: "The joy of giving",
        body: [
          "The Gita calls a gift sattvic, of the nature of goodness, when it is given because giving is right, at the proper time and place, to a worthy person who cannot return the favour (17.20). Giving loosens money's grip on the heart and reminds us that we are caretakers, not owners.",
          "Start with an amount that feels comfortable, perhaps a small fixed share of what you earn, and give it regularly. For those on a devotional path, Krishna's promise to provide what His devotees lack and preserve what they have (9.22) can ease worry. That trust sits beside careful planning, not in place of it; for big decisions, seek advice from a qualified financial professional.",
        ],
      },
    ],
    practice: [
      "Write down every expense from the past three days, without judging, simply to see where your money goes.",
      "Write one paragraph describing what a comfortable, sufficient life — your 'enough' — means for you.",
      "Spend nothing non-essential today, and notice any urges that arise.",
      "Give something today — money, food or time — to someone who cannot repay you, quietly.",
      "Set up one small automatic habit: a savings amount, a giving amount or a bill reminder.",
      "Look at one source of income or one money habit and ask honestly: is this fully fair and truthful?",
      "Before a meal, give thanks for the food, for the work that paid for it and for those who share it with you.",
    ],
    reflection: [
      "What did I learn about money growing up, and is it still serving me?",
      "How much is enough for me, and how will I know when I have reached it?",
      "Where could my money do more good than it is doing now?",
    ],
    gita: ["3.8", "17.20", "9.22"],
    katha: ["kuberas-feast"],
  },
  {
    slug: "relationships",
    title: "Relationships",
    sanskrit: "सम्बन्ध",
    sanskritRoman: "Sambandha",
    tagline: "Love that listens, speaks kindly and stays.",
    overview:
      "Our relationships shape our happiness more than almost anything else. The Gita's vision of seeing others as we see ourselves, and of speech that is true, kind and helpful, offers a practical foundation for family, friendship and partnership. This course helps you love with more patience, more honesty and less keeping score.",
    lessons: [
      {
        title: "See others as yourself",
        body: [
          "The Gita honours the one who, taking oneself as the measure, sees equally everywhere, in pleasure and in pain (6.32). In everyday terms: before reacting, imagine how this moment feels from the other side.",
          "Most conflicts soften when each person feels understood. The Gita describes the one dear to the Divine as friendly and compassionate toward all (12.13). Listening to understand, not to reply, is one of the most loving things you can offer.",
        ],
      },
      {
        title: "Friendship is not measured by wealth",
        body: [
          "In the Bhagavata Purana, a poor brahmin who had been Krishna's childhood friend, remembered in later tradition as Sudama, visits him in Dwarka with only a small bundle of flattened rice. Krishna welcomes him with deep affection and receives the humble gift with joy. What mattered was the heart behind it.",
          "Healthy relationships are not transactions. Show up, remember birthdays and hard days, and offer what you can, even if it seems small. Presence often means more than presents.",
        ],
      },
      {
        title: "Speak with care, stand by those you love",
        body: [
          "The Gita describes speech that is truthful, pleasant, beneficial and causes no distress as the tapas, or disciplined practice, of speech (17.15). Honesty and kindness are not opposites; with practice, you can say the true thing in a kind way.",
          "In the Mahabharata, Savitri follows Yama, the lord of death, as he carries away her husband Satyavan's life. Through steady love and wise, gracious words, she wins Satyavan back. Lasting love joins devotion with wisdom and commitment with mutual respect, and respect includes healthy boundaries. Nothing here asks anyone to accept harm in silence; if you feel unsafe in a relationship, please reach out to someone you trust or to a qualified professional or support service.",
        ],
      },
    ],
    practice: [
      "In one conversation today, listen without interrupting, then repeat back what you heard before you reply.",
      "Send a message of appreciation to someone you love, naming one specific thing you value about them.",
      "Before a difficult conversation, ask whether what you want to say is true, kind and helpful, and adjust one sentence.",
      "Reach out to an old friend you have lost touch with, simply to say you thought of them.",
      "Share a meal or ten minutes with family or a friend, with every phone put away.",
      "Offer a sincere apology for one thing, small or large, without adding 'but'.",
      "Pray for, or silently wish well, three people: someone you love, someone you find difficult and someone you barely know.",
    ],
    reflection: [
      "In which relationship do I most need to listen more and speak less?",
      "Where am I keeping score, and what would change if I stopped?",
      "What would love look like this week if I put it into action rather than words?",
    ],
    gita: ["6.32", "12.13", "17.15"],
    katha: ["sudama-handful-of-rice", "savitri-and-yama"],
  },
  {
    slug: "discipline",
    title: "Discipline",
    sanskrit: "तपस्",
    sanskritRoman: "Tapas",
    tagline: "Small steady steps, repeated with love.",
    overview:
      "Tapas literally means 'heat': the warmth of steady effort that refines us over time. In the Gita, discipline is not harshness but balance and practice: moderate habits, a mind gently brought back, and focus on what matters. This course helps you build discipline that is kind, sustainable and your own.",
    lessons: [
      {
        title: "Balance, not extremes",
        body: [
          "The Gita recommends moderation in eating and recreation, balanced effort in work and regular sleep and waking, and says that for such a person yoga becomes the destroyer of sorrow (6.17). Real discipline is rhythm, not punishment.",
          "Start with your foundations: a steady wake-up time, simple nourishing meals and enough rest. Habits built on balance tend to last; habits built on willpower alone tend to collapse.",
        ],
      },
      {
        title: "Bring the mind back, again and again",
        body: [
          "Arjuna admits that the mind is restless, and Krishna agrees: it is hard to restrain, but it can be trained through practice (abhyāsa) and detachment (vairāgya) (6.35). Wherever the mind wanders, gently bring it back (6.26).",
          "This is the whole art. You will get distracted; that is not failure. Each return is one repetition, and repetitions build strength, just as they do for a muscle.",
        ],
      },
      {
        title: "Focus on the one thing",
        body: [
          "In the Mahabharata, the teacher Drona tests his students as they aim at a wooden bird placed in a tree, asking what each of them sees. The others describe the tree, their teacher, their brothers and the bird. Arjuna says he sees only the bird, and then only its head; the well-known retelling sharpens this to its eye. Focus is the quiet secret behind his mastery.",
          "Choose the one thing that matters most this week and give it your undivided attention for a short time each day. The Gita asks us to lift ourselves by our own effort, for the self can be its own best friend (6.5).",
        ],
      },
    ],
    practice: [
      "Choose a fixed wake-up time for this week and keep it today, without pressing snooze.",
      "Sit quietly for five minutes, watching your breath. Each time the mind wanders, gently bring it back.",
      "Work on one task for fifteen minutes with your phone in another room.",
      "Eat one meal slowly and moderately; if it suits your path, make it a simple sattvic meal (fresh, light, wholesome food, as yogic tradition recommends).",
      "Keep one small promise to yourself: a short walk, a page of reading, or no screens after a set time.",
      "Notice one urge today — to snack, scroll or postpone — and wait ten minutes before deciding.",
      "Review your week kindly: write what helped you stay steady, and choose one habit to carry forward.",
    ],
    reflection: [
      "Which habit, kept steadily for a year, would change my life the most?",
      "Where am I too harsh with myself, and where am I too lenient?",
      "What usually pulls my attention away, and how can I make returning easier?",
    ],
    gita: ["6.17", "6.35", "6.26", "6.5"],
    katha: ["arjuna-and-the-birds-eye"],
  },
  {
    slug: "service",
    title: "Service",
    sanskrit: "सेवा",
    sanskritRoman: "Sevā",
    tagline: "Every act offered with love becomes worship.",
    overview:
      "Sevā is selfless service: helping others without seeking reward or recognition. The Gita teaches that work done without attachment and offered to the Divine purifies the heart and connects us to something larger than ourselves. This course helps you find joy in small, everyday service at home, at work and in your community.",
    lessons: [
      {
        title: "Work without clinging",
        body: [
          "'Without attachment, always perform the work that has to be done' (3.19). Service begins with ordinary responsibilities: cooking for family, helping a colleague, caring for an elder. Done without demanding thanks, these become sevā.",
          "The Gita compares such a person to a lotus leaf, untouched by the water it rests on (5.10). You can work in the thick of life without being weighed down, because the work is offered, not owned.",
        ],
      },
      {
        title: "No service is too small",
        body: [
          "In a much-loved folk tale from later Ramayana tradition, a tiny squirrel helps Rama's army build the bridge to Lanka, carrying what little sand it can to the stones. Others may overlook it, but Rama himself honours its effort. Size does not measure sincerity.",
          "You don't need a grand project to serve. A kind word, a shared meal, an hour of help or simply listening: each is a grain of sand in the bridge.",
        ],
      },
      {
        title: "See yourself in those you serve",
        body: [
          "The Gita honours the one who, taking oneself as the measure, sees equally everywhere (6.32). Service flows naturally from this vision: when you see yourself in others, helping them stops being a chore.",
          "Serve with respect, not pity. Ask what people need instead of assuming, and protect their dignity. And remember to rest: serving from exhaustion helps no one for long, and caring for your own health is part of caring for others.",
        ],
      },
    ],
    practice: [
      "Do one household task that usually falls to someone else, without mentioning it.",
      "Ask one person today, 'Is there anything I can help with?' and follow through.",
      "Before you begin your work today, say inwardly, 'May this be useful to someone,' and offer it as sevā.",
      "Give ten minutes of full attention to an elder, a child or someone who may be lonely.",
      "Do one small act for your community or surroundings: pick up litter, water a plant, help a neighbour.",
      "Support a cause you believe in with a small donation, or a kind message to the people who run it.",
      "Remember someone who served you selflessly and thank them — or, if you cannot reach them, pray for them.",
    ],
    reflection: [
      "Where in my daily life am I already serving, perhaps without noticing?",
      "Do I serve to be seen or to help, and how can I tell the difference?",
      "What gifts or skills do I have that could serve others more?",
    ],
    gita: ["3.19", "5.10", "6.32"],
    katha: ["the-squirrel-at-the-bridge"],
  },
  {
    slug: "gratitude",
    title: "Gratitude",
    sanskrit: "कृतज्ञता",
    sanskritRoman: "Kṛtajñatā",
    tagline: "Notice the gifts, and life becomes a prayer.",
    overview:
      "Kṛtajñatā means 'knowing what has been done for you': recognising the countless gifts that hold your life up. Gratitude does not deny difficulty; it widens your view so you can see the good alongside it. In the Gita, a leaf, a flower, a fruit or a little water offered with devotion is enough (9.26), and a grateful heart is one of the simplest ways to make such an offering.",
    lessons: [
      {
        title: "Recognise what holds you up",
        body: [
          "The Gita reminds us that we are never the only doer (3.27). The food on your plate, the language you speak and the skills you use were all given to you, in some way, by others. Gratitude begins with simply noticing this.",
          "Try it with one ordinary thing, like a glass of water. Think of the rain, the earth, the pipes and the people behind it. Seeing that web of support makes it hard to feel alone or entitled.",
        ],
      },
      {
        title: "Offer what you have",
        body: [
          "'Whoever offers Me with devotion a leaf, a flower, a fruit or water… I accept' (9.26). The Divine asks not for grandeur but for love. Gratitude is how we respond to every gift: not by paying it back, but by offering it onward with a full heart.",
          "In the Ramayana, the devoted ascetic Shabari waits faithfully at her teachers' hermitage for Rama to come. When he finally arrives, she welcomes him with fruits she has gathered herself. Her devotion and gratitude, not wealth, made her offering precious.",
        ],
      },
      {
        title: "Gratitude on hard days",
        body: [
          "Gratitude is easy when life is smooth. On harder days it may simply be: 'I am still here. Someone helped me today. I have this breath.' This is not pretending everything is fine; it is refusing to let difficulty be the only story.",
          "For those who walk a devotional path, the Gita's promise that the Divine provides what devotees lack and preserves what they have (9.22) can turn worry into thanksgiving. A short prayer of thanks morning and night, or a few minutes of naam jap (gently repeating a divine name), keeps that remembrance alive.",
        ],
      },
    ],
    practice: [
      "Before getting out of bed, name three things you are grateful for, however small.",
      "Pick one everyday object and trace all the people and resources that brought it to you.",
      "Write a short thank-you note to someone who helped you and was never properly thanked.",
      "Before eating, pause to give thanks for the food, the hands that prepared it and the earth that grew it.",
      "Offer something simple with love — a flower, a lit lamp, a glass of water at your altar, or a kind act — as a gift of thanks.",
      "In one difficult moment today, ask, 'What is still good here?' and write down one answer.",
      "Spend ten minutes in a prayer of thanks or gentle naam jap, such as Radha Naam Jap (softly repeating Radha's name), if it is part of your devotion; otherwise, write a page of gratitude.",
    ],
    reflection: [
      "Who has shaped my life in ways I have never fully acknowledged?",
      "Which gifts do I take for granted until they are gone?",
      "How can I express gratitude through action, not just words?",
    ],
    gita: ["9.26", "3.27", "9.22"],
    katha: ["shabari-waits-for-rama"],
  },
  {
    slug: "leadership",
    title: "Leadership",
    sanskrit: "नेतृत्व",
    sanskritRoman: "Netṛtva",
    tagline: "Lead by example. Hold power as a trust.",
    overview:
      "Everyone leads somewhere: at home, at work, among friends or simply through the example they set. The Gita teaches that people follow what leaders do, not just what they say, and that the best leaders serve a purpose larger than themselves. This course explores leadership rooted in humility, integrity and service.",
    lessons: [
      {
        title: "People follow what you do",
        body: [
          "'Whatever a great person does, others follow. Whatever standard such a person sets, the world follows' (3.21). Your team, your children and your friends watch how you handle pressure, mistakes and success far more closely than they listen to your advice.",
          "So lead first with your own conduct. Keep your word, admit your mistakes and treat everyone with the same respect. Example is the most persuasive speech there is.",
        ],
      },
      {
        title: "Power as a trust, not a possession",
        body: [
          "In the Ramayana, when Rama is sent into exile, his brother Bharata is offered the throne. He refuses to take what he believes belongs to Rama. Instead, he places Rama's sandals on the throne and governs as a caretaker for fourteen years, living simply outside the capital.",
          "Bharata shows that true leadership is stewardship. A position is held on behalf of others: a family, a team, a people. Leaders who see themselves as servants of a purpose earn a trust that no title can command.",
        ],
      },
      {
        title: "Wisdom and action together",
        body: [
          "The Gita closes with Sanjaya's words: wherever there is Krishna, the master of yoga, and Arjuna, the archer, there are fortune, victory, prosperity and steadfast righteousness (18.78). Many read this as a picture of good leadership: clear wisdom joined with capable action.",
          "Lead without attachment to applause (3.19). Listen widely, decide carefully, act with courage and share the credit. When things go wrong, take responsibility first; when they go right, thank the team.",
        ],
      },
    ],
    practice: [
      "Write down one value you want to lead with, and choose one way to show it today.",
      "Keep every small commitment you make today, on time.",
      "In a meeting or family conversation, invite the quietest person to share their view.",
      "Credit someone publicly for their contribution, specifically and sincerely.",
      "Own one mistake openly and say what you will do differently.",
      "Spend ten minutes thinking about the people who rely on you: what does each of them need from you right now?",
      "Do one task you would usually hand to others, working alongside your team or family as an act of service.",
    ],
    reflection: [
      "What example am I setting, at home and at work, without realising it?",
      "Do I treat my role as a possession or as a trust?",
      "Which leader do I admire most, and which of their qualities can I practise this week?",
    ],
    gita: ["3.21", "3.19", "18.78"],
    katha: ["bharata-and-the-sandals"],
  },
  {
    slug: "success-and-failure",
    title: "Success & Failure",
    sanskrit: "समत्व",
    sanskritRoman: "Samatva",
    tagline: "Give your best. Stay steady either way.",
    overview:
      "Samatva means evenness of mind: a steadiness that is not thrown by praise or blame, gain or loss. The Gita calls this evenness yoga itself. This course helps you strive wholeheartedly, learn from setbacks without shame and celebrate wins without losing your balance.",
    lessons: [
      {
        title: "Evenness is yoga",
        body: [
          "'Perform your actions… remaining the same in success and failure. This evenness of mind is called yoga' (2.48). Evenness is not indifference. You still care and still try your hardest; you simply don't let the outcome decide your worth.",
          "Treating 'pleasure and pain, gain and loss, victory and defeat' alike (2.38) is a lifelong practice. It begins with small things: a missed bus, a compliment, a rejection email. Each is a chance to become a little steadier.",
        ],
      },
      {
        title: "Failure is an event, not an identity",
        body: [
          "In a beloved story from later tradition, Ratnakar, a highway robber, is moved to change his life, sits in long meditation and becomes Valmiki, the first poet and the author of the Ramayana. Whatever has gone before, a new beginning remains possible.",
          "When you fail, separate what happened from who you are. Ask what you learned, what is in your control next time and who could help. Then take one small step. The effort is yours; the results were never fully in your hands (2.47).",
        ],
      },
      {
        title: "Be kind to yourself on the way",
        body: [
          "Success can inflate the ego and failure can crush it; both pull you away from your centre. Celebrate wins with gratitude to those who helped, and meet setbacks with the same kindness you would offer a close friend.",
          "Setbacks can hurt deeply, and that is human. If disappointment turns into lasting sadness, hopelessness or a feeling that you cannot cope, please reach out to someone you trust and to a doctor or qualified mental-health professional. If you ever have thoughts of harming yourself, contact local emergency services or a crisis helpline right away; you deserve support. Spiritual practice complements that care; it does not replace it.",
        ],
      },
    ],
    practice: [
      "Write down one recent success and one recent setback, and beside each note what it taught you.",
      "Before a task today, set your intention on effort, not outcome: 'I will give this my full attention.'",
      "When praise or criticism comes your way today, take one breath before responding and notice how steady you can stay.",
      "Read Gita 2.48 slowly, then write it in your own words on a card you can carry.",
      "Talk with someone you trust about a failure that taught you something important.",
      "Try one small thing you may not be good at yet — a new recipe, a sketch, a question in class — just to practise being a beginner.",
      "List three times life redirected you after a disappointment, and give thanks for where those turns led.",
    ],
    reflection: [
      "How do I speak to myself after a failure, and would I speak that way to a friend?",
      "What would I attempt if I knew my worth did not depend on the result?",
      "How can I celebrate success in a way that keeps me humble and grateful?",
    ],
    gita: ["2.48", "2.38", "2.47"],
    katha: ["ratnakar-becomes-valmiki"],
  },
];

export function gurukulBySlug(slug: string): GurukulTopic | undefined {
  return GURUKUL.find((t) => t.slug === slug);
}
