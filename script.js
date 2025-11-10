//OpenAI
import OpenAI from "openai";
import { config } from 'dotenv';
config({ path: './code.env' });
const client = new OpenAI();

//consts
const profBonus = 2;
const difficultyClasses = {
    'Very easy': 5,
    'Easy': 10,
    'Medium': 15,
    'Hard': 20,
    'Very Hard': 25,
    'Nearly Impossible': 30,
};
const classes = ['Artificer', 'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'];
const subclasses = {
    'Artificer': ['Alchemist', 'Armorer', 'Artillerist', 'Battle Smith'],
    'Barbarian': ['Path of the Berserker', 'Path of the Totem Warrior'],
    'Bard': ['College of Lore', 'College of Glamour', 'College of Swords', 'College of Valor', 'College of Creation', 'College of Whispers', 'College of Eloquence', 'College of Spirits', 'College Of Clowns', 'College of Dance', 'College of Shadows', 'College of Satire'],
    'Cleric': ['Knowledge Domain', 'Life Domain', 'Light Domain', 'Nature Domain', 'Tempest Domain', 'Trickery Domain', 'War Domain'],
    'Druid': ['Circle of the Land', 'Circle of the Artic', 'Circle of the Coast', 'Circle of the Desert', 'Circle of the Forest', 'Circle of the Grassland', 'Circle of the Mountain', 'Circle of the Swamp', 'Circle of the Underdark', 'Circle of the Shepherd'],
    'Fighter': ['Champion', 'Battle Master', 'Eldritch Knight', 'Cavalier', 'Samurai'],
    'Monk': ['Way of the Open Hand', 'Way of Shadow', 'Way of the Four Elements', 'Way of the Drunken Master'],
    'Paladin': ['Oath of Devotion', 'Oath of the Ancients', 'Oath of Vengeance', 'Oath of Conquest', 'Oath of Redemption'],
    'Ranger': ['Hunter', 'Beast Master'],
    'Rogue': ['Thief', 'Assassin', 'Arcane Trickster', 'Mastermind'],
    'Sorcerer': ['Draconic Bloodline', 'Wild Magic'],
    'Warlock': ['The Archfey', 'The Fiend', 'The Great Old One'],
    'Wizard': ['School of Abjuration', 'School of Conjuration', 'School of Divination', 'School of Enchantment', 'School of Evocation', 'School of Illusion', 'School of Necromancy', 'School of Transmutation']
};
const races = ['Dwarf', 'Elf', 'Halfling', 'Human', 'Dragonborn', 'Gnome', 'Half-Elf', 'Half-Orc', 'Tiefling'];
const charSubraces = {
    'Dwarf': ['Hill Dwarf', 'Mountain Dwarf'],
    'Elf': ['High Elf', 'Wood Elf', 'Dark Elf (Drow)'],
    'Halfling': ['Lightfoot Halfling', 'Stout Halfling'],
    'Human': [],
    'Gnome': ['Forest Gnome', 'Rock Gnome'],
    'Dragonborn': [],
    'Half-Elf': [],
    'Half-Orc': [],
    'Tiefling': []
};
const alignments = ["Lawful Good", "Neutral Good", "Chaotic Good", "Lawful Neutral", "True Neutral", "Chaotic Neutral", "Lawful Evil", "Neutral Evil", "Chaotic Evil"];
const backgrounds = ['Acolyte', 'Charlatan', 'Criminal', 'Entertainer', 'Folk Hero', 'Guild Artisan', 'Hermit', 'Noble', 'Outlander', 'Sage', 'Sailor', 'Soldier', 'Urchin'];
const languages = ['Common', 'Dwarvish', 'Elvish', 'Halfling', 'Orc', 'Infernal', 'Draconic', 'Gnomish', 'Sylvan', 'Celestial', 'Goblin', 'Undercommon'];
const preferredEnemiesLang = {
    'Aberration': ['Deep Speech', 'Undercommon'],
    'Beast': ['—'],  // Most beasts don’t speak, though some rare magical beasts might
    'Celestial': ['Celestial'],
    'Construct': ['—'], // Constructs typically do not speak
    'Dragon': ['Draconic'],
    'Elemental': ['Auran', 'Ignan', 'Terran', 'Aquam'], // depends on element type
    'Fey': ['Elvish', 'Sylvan'],
    'Fiend': ['Abyssal', 'Infernal'],
    'Giant': ['Giant'],
    'Humanoid': ['Common', 'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Orc', 'Auran', 'Infernal'], // common humanoid languages
    'Monstrosity': ['—'], // Usually do not speak
    'Ooze': ['—'], // Non-intelligent
    'Plant': ['—'], // Non-intelligent
    'Undead': ['Common', 'Infernal', 'Undercommon']
};
const genders = ['Male', 'Female'];
const personalities = {
    'Acolyte': ['I idolize a particular hero of my faith, and constantly refer to that person\'s deeds and example.', 'I can find common ground between the fiercest enemies, empathizing with them and always working towards piece.', 'I see omens in every event and action. The gods try to speak to us, we just need to listen.', 'Nothing can shake my optimistic attitude.', 'I quote (or misquote) sacred texts and proverbs in almost every situation.', 'I am tolerant (or intolerant) of other faiths and respect (or condemn) the worship of other gods.', 'I\'ve enjoyed fine food, drink, and high society among my temple\'s elite. Rough living grates on me.', 'I\'ve spent so long in the temple that I have little practical experience dealing with people in the outside world.'],
    'Charlatan': ['I fall in and out of love easily, and am always pursuing someone.', 'I have a joke for every occasion, especially occasions where humor is inappropriate.', 'Flattery is my preferred trick for getting what I want.', 'I\'m a born gambler who can\'t resist taking a risk for a potential payoff.', 'I lie about almost everything, even when there\'s no good reason to.', 'Sarcasm and insults are my weapons of choice.', 'I keep multiple holy symbols on me and invoke whatever deity might come in useful at any given moment.', 'I pocket anything I see that might have some value.'],
    'Criminal': ['I always have a plan for what to do when things go wrong.', 'I am always calm, no matter what the situation. I never raise my voice or let my emotions control me.', 'The first thing I do in a new place is note the locations of everything valuable—or where such things could be hidden.', 'I would rather make a new friend than a new enemy.', 'I am incredibly slow to trust. Those who seem the fairest often have the most to hide.', 'I don\'t pay attention to the risks in a situation. Never tell me the odds.', 'The best way to get me to do something is to tell me I can\'t do it.', 'I blow up at the slightest insult.'],
    'Entertainer': ['I know a story relevant to almost every situation.', 'Whenever I come to a new place, I collect local rumors and spread gossip.', 'I\'m a hopeless romantic, always searching for that “special someone.”', 'Nobody stays angry at me or around me for long, since I can defuse any amount of tension.', 'I love a good insult, even one directed at me.', 'I get bitter if I\'m not the center of attention.', 'I\'ll settle for nothing less than perfection.', 'I change my mood or my mind as quickly as I change key in a song.'],
    'Folk Hero': ['I judge people by their actions, not their words.', 'If someone is in trouble, I\'m always ready to lend help.', 'When I set my mind to something, I follow through no matter what gets in my way.', 'I have a strong sense of fair play and always try to find the most equitable solution to arguments.', 'I\'m confident in my own abilities and do what I can to instill confidence in others.', 'Thinking is for other people. I prefer action.', 'I misuse long words in an attempt to sound smarter.', 'I get bored easily. When am I going to get on with my destiny?'],
    'Guild Artisan': ['I believe that anything worth doing is worth doing right. I can\'t help it— I\'m a perfectionist.', 'I\'m a snob who looks down on those who can\'t appreciate fine art.', 'I always want to know how things work and what makes people tick.', 'I\'m full of witty aphorisms and have a proverb for every occasion.', 'I\'m rude to people who lack my commitment to hard work and fair play.', 'I like to talk at length about my profession.', 'I don\'t part with my money easily and will haggle tirelessly to get the best deal possible.', 'I\'m well known for my work, and I want to make sure everyone appreciates it. I\'m always taken aback when people haven\'t heard of me.'],
    'Hermit': ['I\'ve been isolated for so long that I rarely speak, preferring gestures and the occasional grunt.', 'I am utterly serene, even in the face of disaster.', 'The leader of my community had something wise to say on every topic, and I am eager to share that wisdom.', 'I feel tremendous empathy for all who suffer.', 'I\'m oblivious to etiquette and social expectations.', 'I connect everything that happens to me to a grand, cosmic plan.', 'I often get lost in my own thoughts and contemplation, becoming oblivious to my surroundings.', 'I am working on a grand philosophical theory and love sharing my ideas.'],
    'Noble': ['My eloquent flattery makes everyone I talk to feel like the most wonderful and important person in the world.', 'The common folk love me for my kindness and generosity.', 'No one could doubt by looking at my regal bearing that I am a cut above the unwashed masses.', 'I take great pains to always look my best and follow the latest fashions.', 'I don\'t like to get my hands dirty, and I won\'t be caught dead in unsuitable accommodations.', 'Despite my noble birth, I do not place myself above other folk. We all have the same blood.', 'My favor, once lost, is lost forever.', 'If you do me an injury, I will crush you, ruin your name, and salt your fields.'],
    'Outlander': ['I\'m driven by a wanderlust that led me away from home.', 'I watch over my friends as if they were a litter of newborn pups.', 'I once ran twenty-five miles without stopping to warn my clan of an approaching horde. I\'d do it again if I had to.', 'I have a lesson for every situation, drawn from observing nature.', 'I place no stock in wealthy or well-mannered folk. Money and manners won\'t save you from a hungry owlbear.', 'I\'m always picking things up, absently fiddling with them, and sometimes accidentally breaking them.', 'I feel far more comfortable around animals than people.', 'I was, in fact, raised by wolves.'],
    'Sage': ['I use polysyllabic words that convey the impression of great erudition.', 'I\'ve read every book in the world\'s greatest libraries—or I like to boast that I have.', 'I\'m used to helping out those who aren\'t as smart as I am, and I patiently explain anything and everything to others.', 'There\'s nothing I like more than a good mystery.', 'I\'m willing to listen to every side of an argument before I make my own judgment.', 'I... speak... slowly... when talking... to idiots... which... almost... everyone... is... compared... to me.', 'I am horribly, horribly awkward in social situations.', 'I\'m convinced that people are always trying to steal my secrets.'],
    'Sailor': ['My friends know they can rely on me, no matter what.', 'I work hard so that I can play hard when the work is done.', 'I enjoy sailing into new ports and making new friends over a flagon of ale.', 'I stretch the truth for the sake of a good story.', 'To me, a tavern brawl is a nice way to get to know a new city.', 'I never pass up a friendly wager.', 'My language is as foul as an otyugh nest.', 'I like a job well done, especially if I can convince someone else to do it.'],
    'Soldier': ['I\'m always polite and respectful.', 'I\'m haunted by memories of war. I can\'t get the images of violence out of my mind.', 'I\'ve lost too many friends, and I\'m slow to make new ones.', 'I\'m full of inspiring and cautionary tales from my military experience relevant to almost every combat situation.', 'I can stare down a hell hound without flinching.', 'I enjoy being strong and like breaking things.', 'I have a crude sense of humor.', 'I face problems head-on. A simple, direct solution is the best path to success.'],
    'Urchin': ['I hide scraps of food and trinkets away in my pockets.', 'I ask a lot of questions.', 'I like to squeeze into small places where no one else can get to me.', 'I sleep with my back to a wall or tree, with everything I own wrapped in a bundle in my arms.', 'I eat like a pig and have bad manners.', 'I think anyone who\'s nice to me is hiding evil intent.', 'I don\'t like to bathe.', 'I bluntly say what other people are hinting at or hiding.']
};
const ideals = {
    'Acolyte': ['The ancient traditions of worship and sacrifice must be preserved and upheld.', 'I always try to help those in need, no matter what the personal cost.', 'We must help bring about the changes the gods are constantly working in the world.', 'I hope to one day rise to the top of my faith\'s religious hierarchy.', 'I trust that my deity will guide my actions, I have faith that if I work hard, things will go well.', 'I seek to prove myself worthy of my god\'s favor by matching my actions against his or her teachings.'],
    'Charlatan': ['I am a free spirit—no one tells me what to do.', 'I never target people who can\'t afford to lose a few coins.', 'I distribute the money I acquire to the people who really need it.', 'I never run the same con twice.', 'Material goods come and go. Bonds of friendship last forever.', 'I\'m determined to make something of myself.'],
    'Criminal': ['Honor. I don\'t steal from others in the trade.', 'Freedom. Chains are meant to be broken, as are those who would forge them.', 'Charity. I steal from the wealthy so that I can help people in need.', 'Greed. I will do whatever it takes to become wealthy.', 'People. I\'m loyal to my friends, not to any ideals, and everyone else can take a trip down the Styx for all I care.', 'Redemption. There\'s a spark of good in everyone.'],
    'Entertainer': ['Beauty. When I perform, I make the world better than it was.', 'Tradition. The stories, legends, and songs of the past must never be forgotten.', 'Creativity. The world is in need of new ideas and bold action.', 'Greed. I\'m only in it for the money and fame.', 'People. I like seeing the smiles on people\'s faces when I perform. That\'s all that matters.', 'Honesty. Art should reflect the soul; it should come from within and reveal who we really are.'],
    'Folk Hero': ['Respect. People deserve to be treated with dignity and respect.', 'Fairness. No one should get preferential treatment before the law, and no one is above the law.', 'Freedom. Tyrants must not be allowed to oppress the people.', 'Might. If I become strong, I can take what I want—what I deserve.', 'Sincerity. There\'s no good in pretending to be something I\'m not.', 'Destiny. Nothing and no one can steer me away from my higher calling.'],
    'Guild Artisan': ['Community. It is the duty of all civilized people to strengthen the bonds of community and the security of civilization.', 'Generosity. My talents were given to me so that I could use them to benefit the world.', 'Freedom. Everyone should be free to pursue their own livelihood.', 'Greed. I\'m only in it for the money.', 'People. I\'m committed to the people I care about, not to ideals.', 'Aspiration. I work hard to be the best there is at my craft.'],
    'Hermit': ['Greater Good. My gifts are meant to be shared with all, not used for my own benefit.', 'Logic. Emotions must not cloud our sense of what is right and true, or our logical thinking.', 'Free Thinking. Inquiry and curiosity are the pillars of progress.', 'Power. Solitude and contemplation are paths toward mystical or magical power.', 'Live and Let Live. Meddling in the affairs of others only causes trouble.', 'Self-Knowledge. If you know yourself, there\'s nothing left to know.'],
    'Noble': ['Respect. Respect is due to me because of my position, but all people deserve to be treated with dignity.', 'Responsibility. It is my duty to respect the authority of those above me, just as those below me must respect mine.', 'Independence. I must prove that I can handle myself without the coddling of my family.', 'Power. If I can attain more power, no one will tell me what to do.', 'Family. Blood runs thicker than water.', 'Noble Obligation. It is my duty to protect and care for the people beneath me.'],
    'Outlander': ['Change. Life is like the seasons, in constant change, and we must change with it.', 'Greater Good. It is each person\'s responsibility to make the most happiness for the whole tribe.', 'Honor. If I dishonor myself, I dishonor my whole clan.', 'Might. The strongest are meant to rule.', 'Nature. The natural world is more important than all the constructs of civilization.', 'Glory. I must earn glory in battle, for myself and my clan.'],
    'Sage': ['Knowledge. The path to power and self-improvement is through knowledge.', 'Beauty. What is beautiful points us beyond itself toward what is true.', 'Logic. Emotions must not cloud our logical thinking.', 'No Limits. Nothing should fetter the infinite possibility of all existence.', 'Power. Knowledge is the path to power and domination.', 'Self-Improvement. The goal of a life of study is the betterment of oneself.'],
    'Sailor': ['Respect. The thing that keeps a ship together is mutual respect between captain and crew.', 'Fairness. We all do the work, so we all share in the rewards.', 'Freedom. The sea is freedom—the freedom to go anywhere and do anything.', 'Mastery. I\'m a predator, and the other ships on the sea are my prey.', 'People. I\'m committed to my crewmates, not to ideals.', 'Aspiration. Someday I\'ll own my own ship and chart my own destiny.'],
    'Soldier': ['Greater Good. Our lot is to lay down our lives in defense of others.', 'Responsibility. I do what I must and obey just authority.', 'Independence. When people follow orders blindly, they embrace a kind of tyranny.', 'Might. In life as in war, the stronger force wins.', 'Live and Let Live. Ideals aren\'t worth killing over or going to war for.', 'Nation. My city, nation, or people are all that matter.'],
    'Urchin': ['Respect. All people, rich or poor, deserve respect.', 'Community. We have to take care of each other, because no one else is going to do it.', 'Change. The low are lifted up, and the high and mighty are brought down. Change is the nature of things.', 'Retribution. The rich need to be shown what life and death are like in the gutters.', 'People. I help the people who help me—that\'s what keeps us alive.', 'Aspiration. I\'m going to prove that I\'m worthy of a better life.']
};
const bonds = {
    'Acolyte': ['I would die to recover an ancient relic of my faith that was lost long ago.', 'I will someday get revenge on the corrupt temple hierarchy who branded me a heretic.', 'I owe my life to the priest who took me in when my parents died.', 'Everything I do is for the common people.', 'I will do anything to protect the temple where I served.', 'I seek to preserve a sacred text that my enemies consider heretical and seek to destroy.'],
    'Charlatan': ['I fleeced the wrong person and must work to ensure that this individual never crosses paths with me or those I care about.', 'I owe everything to my mentor— a horrible person who\'s probably rotting in jail somewhere.', 'Somewhere out there, I have a child who doesn\'t know me. I\'m making the world better for him or her.', 'I come from a noble family, and one day I\'ll reclaim my lands and title from those who stole them from me.', 'A powerful person killed someone I love. Some day soon, I\'ll have my revenge.', 'I swindled and ruined a person who didn\'t deserve it. I seek to atone for my misdeeds but might never be able to forgive myself.'],
    'Criminal': ['I\'m trying to pay off an old debt I owe to a generous benefactor.', 'My ill-gotten gains go to support my family.', 'Something important was taken from me, and I aim to steal it back.', 'I will become the greatest thief that ever lived.', 'I\'m guilty of a terrible crime. I hope I can redeem myself for it.', 'Someone I loved died because of a mistake I made. That will never happen again.'],
    'Entertainer': ['My instrument is my most treasured possession, and it reminds me of someone I love.', 'Someone stole my precious instrument, and someday I\'ll get it back.', 'I want to be famous, whatever it takes.', 'I idolize a hero of the old tales and measure my deeds against that person\'s.', 'I will do anything to prove myself superior to my hated rival.', 'I would do anything for the other members of my old troupe.'],
    'Folk Hero': ['I have a family, but I have no idea where they are. One day, I hope to see them again.', 'I worked the land, I love the land, and I will protect the land.', 'A proud noble once gave me a horrible beating, and I will take my revenge on any bully I encounter.', 'My tools are symbols of my past life, and I carry them so that I will never forget my roots.', 'I protect those who cannot protect themselves.', 'I wish my childhood sweetheart had come with me to pursue my destiny.'],
    'Guild Artisan': ['The workshop where I learned my trade is the most important place in the world to me.', 'I created a great work for someone, and then found them unworthy to receive it. I\'m still looking for someone worthy.', 'I owe my guild a great debt for forging me into the person I am today.', 'I pursue wealth to secure someone\'s love.', 'One day I will return to my guild and prove that I am the greatest artisan of them all.', 'I will get revenge on the evil forces that destroyed my place of business and ruined my livelihood.'],
    'Hermit': ['Nothing is more important than the other members of my hermitage, order, or association.', 'I entered seclusion to hide from the ones who might still be hunting me. I must someday confront them.', 'I\'m still seeking the enlightenment I pursued in my seclusion, and it still eludes me.', 'I entered seclusion because I loved someone I could not have.', 'Should my discovery come to light, it could bring ruin to the world.', 'My isolation gave me great insight into a great evil that only I can destroy.'],
    'Noble': ['I will face any challenge to win the approval of my family.', 'My house\'s alliance with another noble family must be sustained at all costs.', 'Nothing is more important than the other members of my family.', 'I am in love with the heir of a family that my family despises.', 'My loyalty to my sovereign is unwavering.', 'The common folk must see me as a hero of the people.'],
    'Outlander': ['My family, clan, or tribe is the most important thing in my life, even when they are far from me.', 'An injury to the unspoiled wilderness of my home is an injury to me.', 'I will bring terrible wrath down on the evildoers who destroyed my homeland.', 'I am the last of my tribe, and it is up to me to ensure their names enter legend.', 'I suffer awful visions of a coming disaster and will do anything to prevent it.', 'It is my duty to provide children to sustain my tribe.'],
    'Sage': ['It is my duty to protect my students.', 'I have an ancient text that holds terrible secrets that must not fall into the wrong hands.', 'I work to preserve a library, university, scriptorium, or monastery.', 'My life\'s work is a series of tomes related to a specific field of lore.', 'I\'ve been searching my whole life for the answer to a certain question.', 'I sold my soul for knowledge. I hope to do great deeds and win it back.'],
    'Sailor': ['I\'m loyal to my captain first, everything else second.', 'The ship is most important—crewmates and captains come and go.', 'I\'ll always remember my first ship.', 'In a harbor town, I have a paramour whose eyes nearly stole me from the sea.', 'I was cheated out of my fair share of the profits, and I want to get my due.', 'Ruthless pirates murdered my captain and crewmates, plundered our ship, and left me to die. Vengeance will be mine.'],
    'Soldier': ['I would still lay down my life for the people I served with.', 'Someone saved my life on the battlefield. To this day, I will never leave a friend behind.', 'My honor is my life.', 'I\'ll never forget the crushing defeat my company suffered or the enemies who dealt it.', 'Those who fight beside me are those worth dying for.', 'I fight for those who cannot fight for themselves.'],
    'Urchin': ['My town or city is my home, and I\'ll fight to defend it.', 'I sponsor an orphanage to keep others from enduring what I was forced to endure.', 'I owe my survival to another urchin who taught me to live on the streets.', 'I owe a debt I can never repay to the person who took pity on me.', 'I escaped my life of poverty by robbing an important person, and I\'m wanted for it.', 'No one else should have to endure the hardships I\'ve been through.']
};
const flaws = {
    'Acolyte': ['I judge others harshly, and myself even more severely.', 'I put too much trust in those who wield power within my temple\'s hierarchy.', 'My piety sometimes leads me to blindly trust those that profess faith in my god.', 'I am inflexible in my thinking.', 'I am suspicious of strangers and expect the worst of them.', 'Once I pick a goal, I become obsessed with it to the detriment of everything else in my life.'],
    'Charlatan': ['I can\'t resist a pretty face.', 'I\'m always in debt. I spend my ill-gotten gains on decadent luxuries faster than I bring them in.', 'I\'m convinced that no one could ever fool me the way I fool others.', 'I\'m too greedy for my own good. I can\'t resist taking a risk if there\'s money involved.', 'I can\'t resist swindling people who are more powerful than me.', 'I hate to admit it and will hate myself for it, but I\'ll run and preserve my own hide if the going gets tough.'],
    'Criminal': ['When I see something valuable, I can\'t think about anything but how to steal it.', 'When faced with a choice between money and my friends, I usually choose the money.', 'If there\'s a plan, I\'ll forget it. If I don\'t forget it, I\'ll ignore it.', 'I have a “tell” that reveals when I\'m lying.', 'I turn tail and run when things look bad.', 'An innocent person is in prison for a crime that I committed. I\'m okay with that.'],
    'Entertainer': ['I\'ll do anything to win fame and renown.', 'I\'m a sucker for a pretty face.', 'A scandal prevents me from ever going home again. That kind of trouble seems to follow me around.', 'I once satirized a noble who still wants my head. It was a mistake that I will likely repeat.', 'I have trouble keeping my true feelings hidden. My sharp tongue lands me in trouble.', 'Despite my best efforts, I am unreliable to my friends.'],
    'Folk Hero': ['The tyrant who rules my land will stop at nothing to see me killed.', 'I\'m convinced of the significance of my destiny, and blind to my shortcomings and the risk of failure.', 'The people who knew me when I was young know my shameful secret, so I can never go home again.', 'I have a weakness for the vices of the city, especially hard drink.', 'Secretly, I believe that things would be better if I were a tyrant lording over the land.', 'I have trouble trusting in my allies.'],
    'Guild Artisan': ['I\'ll do anything to get my hands on something rare or priceless.', 'I\'m quick to assume that someone is trying to cheat me.', 'No one must ever learn that I once stole money from guild coffers.', 'I\'m never satisfied with what I have— I always want more.', 'I would kill to acquire a noble title.', 'I\'m horribly jealous of anyone who can outshine my handiwork. Everywhere I go, I\'m surrounded by rivals.'],
    'Hermit': ['Now that I\'ve returned to the world, I enjoy its delights a little too much.', 'I harbor dark, bloodthirsty thoughts that my isolation and meditation failed to quell.', 'I am dogmatic in my thoughts and philosophy.', 'I let my need to win arguments overshadow friendships and harmony.', 'I\'d risk too much to uncover a lost bit of knowledge.', 'I like keeping secrets and won\'t share them with anyone.'],
    'Noble': ['I secretly believe that everyone is beneath me.', 'I hide a truly scandalous secret that could ruin my family forever.', 'I too often hear veiled insults and threats in every word addressed to me, and I\'m quick to anger.', 'I have an insatiable desire for carnal pleasures.', 'In fact, the world does revolve around me.', 'By my words and actions, I often bring shame to my family.'],
    'Outlander': ['I am too enamored of ale, wine, and other intoxicants.', 'There\'s no room for caution in a life lived to the fullest.', 'I remember every insult I\'ve received and nurse a silent resentment toward anyone who\'s ever wronged me.', 'I am slow to trust members of other races, tribes, and societies.', 'Violence is my answer to almost any challenge.', 'Don\'t expect me to save those who can\'t save themselves. It is nature\'s way that the strong thrive and the weak perish.'],
    'Sage': ['I am easily distracted by the promise of information.', 'Most people scream and run when they see a demon. I stop and take notes on its anatomy.', 'Unlocking an ancient mystery is worth the price of a civilization.', 'I overlook obvious solutions in favor of complicated ones.', 'I speak without really thinking through my words, invariably insulting others.', 'I can\'t keep a secret to save my life, or anyone else\'s.'],
    'Sailor': ['I follow orders, even if I think they\'re wrong.', 'I\'ll say anything to avoid having to do extra work.', 'Once someone questions my courage, I never back down no matter how dangerous the situation.', 'Once I start drinking, it\'s hard for me to stop.', 'I can\'t help but pocket loose coins and other trinkets I come across.', 'My pride will probably lead to my destruction.'],
    'Soldier': ['The monstrous enemy we faced in battle still leaves me quivering with fear.', 'I have little respect for anyone who is not a proven warrior.', 'I made a terrible mistake in battle that cost many lives—and I would do anything to keep that mistake secret.', 'My hatred of my enemies is blind and unreasoning.', 'I obey the law, even if the law causes misery.', 'I\'d rather eat my armor than admit when I\'m wrong.'],
    'Urchin': ['If I\'m outnumbered, I will run away from a fight.', 'Gold seems like a lot of money to me, and I\'ll do just about anything for more of it.', 'I will never fully trust anyone other than myself.', 'I\'d rather kill someone in their sleep than fight fair.', 'It\'s not stealing if I need it more than someone else.', 'People who can\'t take care of themselves get what they deserve.']
};
const simpleWeapons = ['Club', 'Dagger', 'Greatclub', 'Handaxe', 'Javelin', 'Light Hammer', 'Mace', 'Quarterstaff', 'Sickle', 'Spear', 'Unarmed Strike', 'Light Crossbow', 'Shortbow', 'Dart', 'Sling'];
const martialWeapons = ['Battleaxe', 'Flail', 'Glave', 'Greataxe', 'Greatsword', 'Halberd', 'Lance', 'Longsword', 'Maul', 'Morningstar', 'Pike', 'Rapier', 'Scimitar', 'Shortsword', 'Trident', 'War Pick', 'Warhammer', 'Whip', 'Blowgun', 'Hand Crossbow', 'Heavy Crossbow', 'Longbow', 'Net'];
const simpleMelees = ['Club', 'Dagger', 'Greatclub', 'Handaxe', 'Javelin', 'Light Hammer', 'Mace', 'Quarterstaff', 'Sickle', 'Spear', 'Unarmed Strike'];
const artisansTools = ['Alchemist\'s Supplies', 'Brewer\'s Supplies', 'Calligrapher\'s Supplies', 'Carpenter\'s Tools',
    'Cartographer\'s Tools', 'Cobler\'s Tools', 'Cook\'s Utensils', 'Glassblower\'s Tools', 'Jeweler\'s Tools',
    'Leatherworker\'s Tools', 'Mason\'s Tools', 'Painter\'s Supplies', 'Potter\'s Tools', 'Smith\'s Tools', 'Tinker\'s Tools',
    'Weaver\'s Tools', 'Woodcarver\'s Tools'];
const charlatanTools = ['ten stoppered bottles filled with colored liquid', 'a set of weighted dice', 'a deck of marked cards', 'a signet ring of an imaginary duke'];
const trinkets = [
    'A shard of obsidian that always feels warm to the touch',
    'A mummified goblin hand',
    'A piece of crystal that faintly glows in the moonlight',
    'A dragon\'s bony talon hanging from a plain leather necklace',
    'A gold coin minted in an unknown land',
    'A diary written in a language you don\'t know',
    'A brass ring that never tarnishes',
    'An old chess piece made from glass',
    'A pair of knucklebone dice, each with a skull symbol on the side that would normally show six pips',
    'A silver badge in the shape of a five-pointed star',
    'A knife that belonged to a relative',
    'A small idol depicting a nightmarish creature that gives you unsettling dreams when you sleep near it',
    'A glass vial filled with nail clippings',
    'A rectangular metal device with two tiny metal cups on one end that throws sparks when wet',
    'A white, sequined glove sized for a human',
    'A vest with one hundred tiny pockets',
    'A small, weightless stone block',
    'A tiny sketch portrait of a goblin',
    'An empty glass vial that smells of perfume when opened',
    'A gemstone that looks like a lump of coal when examined by anyone but you',
    'A scrap of cloth from an old banner',
    'A rank insignia from a lost legionnaire',
    'A tiny silver bell without a clapper',
    'A mechanical canary inside a gnomish lamp',
    'A tiny chest carved to look like it has numerous feet on the bottom',
    'A dead sprite inside a clear glass bottle',
    'A metal can that has no opening but sounds as if it is filled with liquid, sand, spiders, or broken glass (your choice)',
    'A small wooden statuette of a smug halfling',
    'A brass orb etched with strange runes',
    'A multicolored stone disk',
    'A tiny silver icon of a raven',
    'A bag containing forty-seven humanoid teeth, one of which is rotten',
    'A silver spoon with an M engraved on the handle',
    'A whistle made from gold-colored wood',
    'A dead scarab beetle the size of your hand',
    'Two toy soldiers, one with a missing head',
    'A small box filled with different-sized buttons',
    'A candle that can\'t be lit',
    'A tiny cage with no door',
    'An old key',
    'An indecipherable treasure map',
    'A hilt from a broken sword',
    'A rabbit\'s foot',
    'A glass eye',
    'A cameo carved in the likeness of a hideous person',
    'A silver skull the size of a coin',
    'An alabaster mask',
    'A pyramid of sticky black incense that smells very bad',
    'A nightcap that, when worn, gives you pleasant dreams',
    'A single caltrop made from bone',
    'A gold monocle frame without the lens',
    'A 1-inch cube, each side painted a different color',
    'A crystal knob from a door',
    'A small packet filled with pink dust',
    'A fragment of a beautiful song, written as musical notes on two pieces of parchment',
    'A silver teardrop earring made from a real teardrop',
    'The shell of an egg painted with scenes of human misery in disturbing detail',
    'A fan that, when unfolded, shows a sleeping cat',
    'A set of bone pipes',
    'A four-leaf clover pressed inside a book discussing manners and etiquette',
    'A sheet of parchment upon which is drawn a complex mechanical contraption',
    'An ornate scabbard that fits no blade you have found so far',
    'An invitation to a party where a murder happened',
    'A bronze pentacle with an etching of a rat\'s head in its center',
    'A purple handkerchief embroidered with the name of a powerful archmage',
    'Half of a floorplan for a temple, castle, or some other structure',
    'A bit of folded cloth that, when unfolded, turns into a stylish cap',
    'A receipt of deposit at a bank in a far-flung city',
    'A diary with seven missing pages',
    'An empty silver snuffbox bearing an inscription on the surface that says “dreams”',
    'An iron holy symbol devoted to an unknown god',
    'A book that tells the story of a legendary hero\'s rise and fall, with the last chapter missing',
    'A vial of dragon blood',
    'An ancient arrow of elven design',
    'A needle that never bends',
    'An ornate brooch of dwarven design',
    'An empty wine bottle bearing a pretty label that says “The Wizard of Wines Winery, Red Dragon Crush, 331422-W”',
    'A mosaic tile with a multicolored, glazed surface',
    'A petrified mouse',
    'A black pirate flag adorned with a dragon\'s skull and crossbones',
    'A tiny mechanical crab or spider that moves about when it\'s not being observed',
    'A glass jar containing lard with a label that reads “Griffon Grease”',
    'A wooden box with a ceramic bottom that holds a living worm with a head on each end of its body',
    'A metal urn containing the ashes of a hero',
    'A 1-ounce block made from an unknown material',
    'A small cloth doll skewered with needles',
    'A tooth from an unknown beast',
    'An enormous scale, perhaps from a dragon',
    'A bright green feather',
    'An old divination card bearing your likeness',
    'A glass orb filled with moving smoke',
    'A 1-pound egg with a bright red shell',
    'A pipe that blows bubbles',
    'A glass jar containing a weird bit of flesh floating in pickling fluid',
    'A tiny gnome-crafted music box that plays a song you dimly remember from your childhood',
    'The deed for a parcel of land in a realm unknown to you',
    'A rope necklace from which dangles four mummified elf fingers',
    'A 1-inch cube, each side painted a different color',
    'A gold monocle frame without the lens',
    'A bright green feather'
];
const instruments = ['Bagpipes', 'Drum', 'Dulcimer', 'Flute', 'Lute', 'Lyre', 'Horn', 'Pan Flute', 'Shawm', 'Viol'];
const arcaneFocuses = ['Crystal', 'Orb', 'Rod', 'Staff', 'Wand'];
const eyes = {
    'Dwarf': ['brown', 'hazel', 'green'],
    'Elf': ['blue', 'gold', 'green', 'brown', 'hazel'],
    'Halfling': ['brown', 'hazel', 'black', 'green'],
    'Human': ['blue', 'brown', 'gray', 'green', 'hazel'],
    'Dragonborn': ['red', 'gold'],
    'Gnome': ['blue', 'dark grey', 'hazel'],
    'Half-Elf': ['blue', 'brown', 'gray', 'green', 'hazel', 'amber', 'gold', 'violet', 'silver'],
    'Half-Orc': ['grey', 'black', 'reddish', 'yellow'],
    'Tiefling': ['black', 'red', 'white', 'silver', 'gold']
};
const skins = {
    'Dwarf': ['deep brown', 'dark tan'],
    'Elf': ['copper', 'bronze', 'bluish-white'],
    'Halfling': ['tan', 'pale'],
    'Human': ['pale', 'tan', 'dark tan', 'deep brown'],
    'Dragonborn': ['dull', 'brass', 'bronze', 'rust', 'red', 'blue', 'gold', 'silver'],
    'Gnome': ['ruddy tan', 'woody brown', 'ashey grey'],
    'Half-Elf': ['pale', 'tan', 'dark tan', 'deep brown', 'copper', 'bronze', 'bluish-white'],
    'Half-Orc': ['grey-ish', 'green-ish', 'purple-ish'],
    'Tiefling': ['pale', 'tan', 'dark tan', 'deep brown', 'blue', 'purple', 'green', 'yellow', 'red']
};
const hairs = {
    'Dwarf': ['black', 'brown', 'gray', 'red', 'blonde'],
    'Elf': ['brown', 'black', 'silver', 'copper red', 'blue', 'even green'],
    'Halfling': ['brown', 'sandy brown'],
    'Human': ['brown', 'black', 'red', 'blonde', 'brunette'],
    'Dragonborn': [],
    'Gnome': ['blonde', 'brown', 'red', 'green', 'white'],
    'Half-Elf': ['brown', 'black', 'silver', 'copper red', 'blue', 'even green', 'red', 'blonde', 'brunette'],
    'Half-Orc': ['black', 'dark brown', 'dark grey'],
    'Tiefling': ['black', 'brown', 'red', 'blue', 'purple']
};
const allies = ["a traveling bard", "a retired knight", "a temple cleric"];
const organizations = ["The Harpers", "The Zhentarim", "Emerald Enclave"];
const allSpells = {
    'Artificer': {
        'cantrips': ['Acid Splash',
            'Booming Blade',
            'Create Bonfire',
            'Dancing Lights',
            'Fire Bolt',
            'Frostbite',
            'Green-Flame Blade',
            'Guidance',
            'Light',
            'Lightning Lure',
            'Mage Hand',
            'Magic Stone',
            'Mending',
            'Message',
            'Poison Spray',
            'Prestidigitation',
            'Ray of Frost',
            'Resistance',
            'Shocking Grasp',
            'Spare the Dying',
            'Sword Burst',
            'Thorn Whip',
            'Thunderclap'],
        'spells': ['Absorb Elements',
            'Alarm',
            'Catapult',
            'Cure Wounds',
            'Detect Magic',
            'Disguise Self',
            'Expeditious Retreat',
            'Faerie Fire',
            'False Life',
            'Feather Fall',
            'Grease',
            'Identify',
            'Jump',
            'Longstrider',
            'Purify Food and Drink',
            'Sanctuary',
            'Snare',
            'Tasha\'s Caustic Brew']
    },
    'Barbarian': { 'cantrips': [], 'spells': [] },
    'Bard': {
        'cantrips': ['Blade Ward',
            'Dancing Lights',
            'Friends',
            'Light',
            'Mage Hand',
            'Mending',
            'Message',
            'Minor Illusion',
            'Prestidigitation',
            'Starry Wisp',
            'Thunderclap',
            'True Strike',
            'Vicious Mockery'],
        'spells': [
            'Animal Friendship',
            'Bane',
            'Charm Person',
            'Color Spray',
            'Command',
            'Comprehend Languages',
            'Cure Wounds',
            'Detect Magic',
            'Disguise Self',
            'Dissonant Whispers',
            'Distort Value',
            'Earth Tremor',
            'Faerie Fire',
            'Feather Fall',
            'Healing Word',
            'Heroism',
            'Identify',
            'Illusory Script',
            'Longstrider',
            'Silent Image',
            'Silvery Barbs',
            'Sleep',
            'Speak with Animals',
            "Tasha's Hideous Laughter",
            'Thunderwave',
            'Unseen Servant',
            'Wardaway']
    },
    'Cleric': {
        'cantrips': [
            'Guidance', 'Light', 'Mending', 'Resistance', 'Sacred Flame', 'Spare the Dying',
            'Thaumaturgy'
        ],
        'spells': [
            'Bane', 'Bless', 'Command', 'Create or Destroy Water', 'Cure Wounds',
            'Detect Evil and Good', 'Detect Magic', 'Detect Poison and Disease',
            'Guiding Bolt', 'Healing Word', 'Inflict Wounds', 'Protection from Evil and Good',
            'Purify Food and Drink', 'Sanctuary', 'Shield of Faith'
        ]
    },
    'Druid': {
        'cantrips': [
            'Druidcraft', 'Guidance', 'Mending', 'Poison Spray', 'Produce Flame', 'Resistance',
            'Shillelagh', 'Thorn Whip'
        ],
        'spells': [
            'Animal Friendship', 'Charm Person', 'Create or Destroy Water', 'Cure Wounds',
            'Detect Magic', 'Detect Poison and Disease', 'Entangle', 'Faerie Fire',
            'Fog Cloud', 'Goodberry', 'Healing Word', 'Jump', 'Longstrider', 'Purify Food and Drink',
            'Speak with Animals'
        ]
    },
    'Fighter': '',  // Eldritch Knight subclass only (starts at level 3)
    'Monk': '',     // Spellcasting via subclasses only (Way of Four Elements, etc.)
    'Paladin': {
        'cantrips': [],
        'spells': [
            'Bless', 'Command', 'Compelled Duel', 'Cure Wounds', 'Detect Evil and Good',
            'Detect Magic', 'Detect Poison and Disease', 'Divine Favor', 'Heroism',
            'Protection from Evil and Good', 'Purify Food and Drink', 'Searing Smite',
            'Shield of Faith', 'Thunderous Smite', 'Wrathful Smite'
        ]
    },
    'Ranger': { 'cantrips': [], 'spells': [] },   // Spellcasting begins at level 2
    'Rogue': { 'cantrips': [], 'spells': [] },    // Spellcasting via Arcane Trickster (level 3)
    'Sorcerer': {
        'cantrips': [
            'Acid Splash', 'Blade Ward', 'Chill Touch', 'Dancing Lights', 'Fire Bolt',
            'Light', 'Mage Hand', 'Mending', 'Message', 'Minor Illusion', 'Poison Spray',
            'Prestidigitation', 'Ray of Frost', 'Shocking Grasp'
        ],
        'spells': [
            'Burning Hands', 'Charm Person', 'Chromatic Orb', 'Color Spray', 'Comprehend Languages',
            'Detect Magic', 'Disguise Self', 'Expeditious Retreat', 'False Life', 'Feather Fall',
            'Fog Cloud', 'Jump', 'Mage Armor', 'Magic Missile', 'Shield', 'Silent Image',
            'Sleep', 'Thunderwave'
        ]
    },
    'Warlock': {
        'cantrips': [
            'Blade Ward', 'Chill Touch', 'Eldritch Blast', 'Friends', 'Mage Hand',
            'Minor Illusion', 'Prestidigitation', 'True Strike'
        ],
        'spells': [
            'Armor of Agathys', 'Arms of Hadar', 'Charm Person', 'Comprehend Languages',
            'Expeditious Retreat', 'Hellish Rebuke', 'Hex', 'Illusory Script', 'Protection from Evil and Good',
            'Unseen Servant', 'Witch Bolt'
        ]
    },
    'Wizard': {
        'cantrips': [
            'Acid Splash', 'Blade Ward', 'Chill Touch', 'Dancing Lights', 'Fire Bolt',
            'Light', 'Mage Hand', 'Mending', 'Message', 'Minor Illusion', 'Poison Spray',
            'Prestidigitation', 'Ray of Frost', 'Shocking Grasp', 'True Strike'
        ],
        'spells': [
            'Alarm', 'Burning Hands', 'Charm Person', 'Chromatic Orb', 'Color Spray', 'Comprehend Languages',
            'Detect Magic', 'Disguise Self', 'Expeditious Retreat', 'False Life', 'Feather Fall', 'Find Familiar',
            'Fog Cloud', 'Grease', 'Identify', 'Jump', 'Longstrider', 'Mage Armor', 'Magic Missile',
            'Protection from Evil and Good', 'Shield', 'Silent Image', 'Sleep', 'Tasha\'s Hideous Laughter',
            'Tenser\'s Floating Disk', 'Thunderwave', 'Unseen Servant'
        ]
    }
};
//discription
const traits = [
  "stoic", "curious", "brooding", "kind-hearted", "mischievous", "stern",
  "haunted", "brave", "reckless", "gentle", "cunning", "noble", "sarcastic"
];
const goals = [
  "seeking redemption for a past mistake",
  "searching for a lost relic",
  "trying to restore their family's honor",
  "looking for a cure to a mysterious curse",
  "driven by an unquenchable thirst for knowledge",
  "hunting the one who betrayed them",
  "protecting those who cannot protect themselves"
];
const origins = [
  "grew up among humble farmers",
  "was raised by wandering merchants",
  "was trained in a remote monastery",
  "survived in the slums of a bustling city",
  "served in a royal court as a scribe",
  "spent years as an outcast in the wilds"
];
const quirks = [
  "has a habit of humming ancient songs",
  "keeps a journal written in multiple languages",
  "collects shiny trinkets from every town they visit",
  "speaks to their weapon as if it were alive",
  "can\'t resist a good riddle",
  "has an odd superstition about the number seven"
];


//main
export async function generateCharacter() {
  const charRace = getRandom(races);
  const charGender = getRandom(genders);
  const entries = Object.entries(difficultyClasses);
  const [name, DC] = entries[Math.floor(Math.random() * entries.length)];
  const NDC = `${name}: ${DC}`;
  const charClass = getRandom(classes);
  const charSubclass = getRandom(subclasses[charClass]);
  const charSubrace = charSubraces[charRace]? getRandom(charSubraces[charRace]): null;
  const charBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  const alignment = alignments[Math.floor(Math.random() * alignments.length)];
  const personality = personalities[charBackground][Math.floor(Math.random() * personalities[charBackground].length)];
  const ideal = ideals[charBackground][Math.floor(Math.random() * ideals[charBackground].length)];
  const bond = bonds[charBackground][Math.floor(Math.random() * bonds[charBackground].length)];
  const flaw = flaws[charBackground][Math.floor(Math.random() * flaws[charBackground].length)];
  const eye = eyes[charRace]?.[Math.floor(Math.random() * eyes[charRace].length)] || "brown";
  const skin = skins[charRace]?.[Math.floor(Math.random() * skins[charRace].length)] || "tan";
  const hair = hairs[charRace]?.length ? getRandom(hairs[charRace]) : "no hair";
  const ally = allies[Math.floor(Math.random() * allies.length)];
  const organization = organizations[Math.floor(Math.random() * organizations.length)];

  // derived attributes
  const charName = getName(charRace, charGender);
  const stats = getStats({ [charRace]: charSubrace });
  const statMods = {
    STR: getMod(stats.STR),
    DEX: getMod(stats.DEX),
    CON: getMod(stats.CON),
    INT: getMod(stats.INT),
    WIS: getMod(stats.WIS),
    CHA: getMod(stats.CHA)
  };
  const initiative = statMods.DEX;
  const skillProficiencies = getSkillProficiencies(charClass, charBackground, charRace);
  const skillModifiers = getSkillModifiers(statMods, skillProficiencies);
  const passivePerception = skillModifiers["Perception"];
  const proficiency = getProficiencies(charClass, charBackground);
  const language = getLanguages(charRace, charClass, charBackground);
  const HP = getHealthPoints(charClass, statMods.CON);
  const hitDice = getHitDice(charClass);
  const AC = getArmorClass(charClass, getArmor(charClass), statMods.DEX, statMods.WIS, statMods.CON);
  const speed = getSpeed(charRace);
  const equipment = getEquipment(charClass, charBackground);
  const features = getFeatures(charRace, charSubrace, charClass);
  const age = getAge(charRace);
  const height = getHeight(charRace);
  const weight = getWeight(charRace);
  const spellClass = getSpellClass(charClass);
  const spellAbility = getSpellAbility(spellClass);
  const spellDC = getSpellDifficultyClass(spellClass, stats);
  const spellAB = getSpellAttackBonus(spellClass, stats);
  const spells = getSpells(spellClass);
  const charData = { charRace, charClass, charGender, charBackground, age, eye, skin, hair, height };

  // === GPT-4 appearance + backstory ===
  let appearance = "", backstory = "";
  try {
    const appearancePrompt = charRace === "Dragonborn"
      ? `Write a short vivid character description for a ${charGender} ${charRace} ${charClass} who used to be a ${charBackground} in D&D. They are ${age} years old with ${eye} eyes and ${skin} skin. They are ${height} tall.`
      : `Write a short vivid character description for a ${charGender} ${charRace} ${charClass} who used to be a ${charBackground} in D&D. They are ${age} years old with ${eye} eyes, ${skin} skin, and ${hair} hair. They are ${height} tall.`;

    const appearanceRes = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [{ role: "user", content: appearancePrompt }]
    });

    const backstoryRes = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [{
        role: "user",
        content: `Write a concise backstory (100–150 words) for a ${charGender} ${charRace} ${charClass} who used to be a ${charBackground} in D&D.`
      }]
    });

    appearance = appearanceRes.choices[0].message.content.trim();
    backstory = backstoryRes.choices[0].message.content.trim();
  } catch (err) {
    console.error("OpenAI request failed, falling back to local generation:", err);
    appearance = generateCharacterDescription(charData);
    backstory = generateBackstory(charData);
  }

  return {
    NDC,
    charName,
    charClass,
    charSubclass,
    charRace,
    charSubrace,
    charBackground,
    alignment,
    charGender,
    stats,
    statMods,
    skillProficiencies,
    skillModifiers,
    passivePerception,
    proficiency,
    language,
    AC,
    initiative,
    speed,
    HP,
    hitDice,
    equipment,
    personality,
    ideal,
    bond,
    flaw,
    features,
    age,
    height,
    weight,
    eye,
    skin,
    hair,
    ally,
    organization,
    appearance,
    backstory,
    spellClass,
    spellAbility,
    spellDC,
    spellAB,
    spells
  };
}

//helper functions//
function generateCharacterDescription({
  charRace,
  charClass,
  charGender,
  charBackground,
  age,
  eye,
  skin,
  hair,
  height
}) {
  const mood = getRandom(["serious", "adventurous", "enigmatic", "determined", "mysterious"]);
  const personality = getRandom(traits);
  const style = getRandom([
    "aura of quiet strength",
    "piercing gaze",
    "calm confidence",
    "air of mystery",
    "warm but cautious smile"
  ]);

  // Dragonborns don’t usually have hair
  const hairPart = charRace === "Dragonborn"
    ? ""
    : `, and ${hair} hair`;

  return `A ${age}-year-old ${charGender} ${charRace} ${charClass} with ${eye} eyes, ${skin} skin${hairPart}. Standing ${height} tall, they carry an ${style}. Once a ${charBackground}, they are ${personality} and ${mood} by nature.`;
}
function generateBackstory({
  charRace,
  charClass,
  charGender,
  charBackground
}) {
  const origin = getRandom(origins);
  const goal = getRandom(goals);
  const quirk = getRandom(quirks);
  const personality = getRandom(traits);

  return `Born a ${charRace}, this ${charGender.toLowerCase()} ${charClass.toLowerCase()} ${origin}. As a ${charBackground.toLowerCase()}, they learned to be ${personality} and resourceful. Now, ${goal}. They ${quirk}, a small reminder of the life they've lived.`;
}
function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function rollStat() {
    let rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
    rolls.sort((a, b) => b - a);
    return rolls.slice(0, 3).reduce((a, b) => a + b);
}
function getMod(stat) {
    return Math.round((stat - 10) / 2);
}
function getName(race, gender) {
    let name = '';
    const names = {
        'Dwarf': {
            'Male': ['Adrik', 'Alberich', 'Baern', 'Barendd', 'Brottor', 'Bruenor', 'Dain', 'Darrak', 'Delg', 'Eberk', 'Fargrim', 'Flint', 'Gardain', 'Harbek', 'Kildrak', 'Morgran', 'Orsik', 'Rangrim', 'Rurik', 'Taklinn', 'Thorin', 'Thrain', 'Traubon', 'Ulfgar', 'Vondal'],
            'Female': ['Amber', 'Artin', 'Audhild', 'Bardryn', 'Dagnal', 'Diesa', 'Elda', 'Falkrunn', 'Finellen', 'Gillydd', 'Gunloda', 'Gurdis', 'Helja', 'Hlin', 'Kathra', 'Kristryd', 'Ilde', 'Liftrasa', 'Mardred', 'Riswynn', 'Sannl', 'Torbera', 'Torgga', 'Vistra'],
            'Family': ['Balderk', 'Battlehammer', 'Brawnanvil', 'Dankil', 'Fireforge', 'Frostbeard', 'Gorunn', 'Holderhek', 'Ironfist', 'Loderr', 'Lutgehr', 'Rumnaheim', 'Strakeln', 'Torunn', 'Ungart']
        },
        'Elf': {
            'Male': ['Adran', 'Aelar', 'Aramil', 'Arannis', 'Aust', 'Beiro', 'Berrian', 'Carric', 'Enialis', 'Erdan', 'Erevan', 'Galinndan', 'Hadarai', 'Heian', 'Himo', 'Immeral', 'Ivellios', 'Laucian', 'Mindartis', 'Paelias', 'Peren', 'Quarion', 'Riardon', 'Rolen', 'Soveliss', 'Thamior', 'Tharivol', 'Theren', 'Varis'],
            'Female': ['Adrie', 'Althaea', 'Anastrianna', 'Andraste', 'Antinua', 'Bethrynna', 'Birel', 'Caelynn', 'Drusilia', 'Enna', 'Felosial', 'Ielenia', 'Jelenneth', 'Keyleth', 'Leshanna', 'Lia', 'Meriele', 'Mialee', 'Naivara', 'Quelenna', 'Quillathe', 'Sariel', 'Shanairra', 'Shava', 'Silaqui', 'Theirastra', 'Thia', 'Vadania', 'Valanthe', 'Xanaphia'],
            'Family': ['Amakiir (Gemflower)', 'Amastacia (Starflower)', 'Galanodel (Moonwhisper)', 'Holimion (Diamonddew)', 'Liadon (Silverfrond)', 'Meliamne (Oakenheel)', 'Naïlo (Nightbreeze)', 'Siannodel (Moonbrook)', 'Xiloscient (Goldpetal)']
        },
        'Halfling': {
            'Male': ['Bilbo', 'Frodo', 'Samwise', 'Alton', 'Ander', 'Cade', 'Corrin', 'Eldon', 'Errich', 'Finnan', 'Garret', 'Lindal', 'Lyle', 'Merric', 'Milo', 'Osborn', 'Perrin', 'Reed', 'Roscoe', 'Wellby'],
            'Female': ['Andry', 'Bree', 'Callie', 'Cora', 'Euphemia', 'Jillian', 'Kithri', 'Lavinia', 'Lidda', 'Merla', 'Nedda', 'Paela', 'Portia', 'Seraphina', 'Shaena', 'Trym', 'Vani', 'Verna'],
            'Family': ['Baggins', 'Brushgather', 'Gamgee', 'Goodbarrel', 'Greenbottle', 'High-hill', 'Hilltopple', 'Leagallow', 'Tealeaf', 'Thorngage', 'Tosscobble', 'Underbough']
        },
        'Human': {
            'Calishite': {
                'Male': ['Aseir', 'Bardeid', 'Haseid', 'Khemed', 'Mehmen', 'Sudeiman', 'Zasheir'],
                'Female': ['Atala', 'Ceidil', 'Hama', 'Jasmal', 'Meilil', 'Seipora', 'Yasheira', 'Zasheida'],
                'Surname': ['Basha', 'Dumein', 'Jassan', 'Khalid', 'Mostana', 'Pashar', 'Rein']
            },
            'Chondathan': {
                'Male': ['Darvin', 'Dorn', 'Evendur', 'Gorstag', 'Grim', 'Helm', 'Malark', 'Morn', 'Randal', 'Stedd'],
                'Female': ['Arveene', 'Esvele', 'Jhessail', 'Kerri', 'Lureene', 'Miri', 'Rowan', 'Shandri', 'Tessele'],
                'Surname': ['Amblecrown', 'Buckman', 'Dundragon', 'Evenwood', 'Greycastle', 'Tallstag']
            },
            'Damaran': {
                'Male': ['Bor', 'Fodel', 'Glar', 'Grigor', 'Igan', 'Ivor', 'Kosef', 'Mival', 'Orel', 'Pavel', 'Sergor'],
                'Female': ['Alethra', 'Kara', 'Katernin', 'Mara', 'Natali', 'Olma', 'Tana', 'Zora'],
                'Surname': ['Bersk', 'Chernin', 'Dotsk', 'Kulenov', 'Marsk', 'Nemetsk', 'Shemov', 'Starag']
            },
            'Illuskan': {
                'Male': ['Ander', 'Blath', 'Bran', 'Frath', 'Geth', 'Lander', 'Luth', 'Malcer', 'Stor', 'Taman', 'Urth'],
                'Female': ['Amafrey', 'Betha', 'Cefrey', 'Kethra', 'Mara', 'Olga', 'Silifrey', 'Westra'],
                'Surname': ['Brightwood', 'Helder', 'Hornraven', 'Lackman', 'Stormwind', 'Windrivver']
            },
            'Mulan': {
                'Male': ['Aoth', 'Bareris', 'Ehput-Ki', 'Kethoth', 'Mumed', 'Ramas', 'So-Kehur', 'Thazar-De', 'Urhur'],
                'Female': ['Arizima', 'Chathi', 'Nephis', 'Nulara', 'Murithi', 'Sefris', 'Thola', 'Umara', 'Zolis'],
                'Surname': ['Ankhalab', 'Anskuld', 'Fezim', 'Hahpet', 'Nathandem', 'Sepret', 'Uuthrakt']
            },
            'Rashemi': {
                'Male': ['Borivik', 'Faurgar', 'Jandar', 'Kanithar', 'Madislak', 'Ralmevik', 'Shaumar', 'Vladislak'],
                'Female': ['Fyevarra', 'Hulmarra', 'Immith', 'Imzel', 'Navarra', 'Shevarra', 'Tammith', 'Yuldra'],
                'Surname': ['Chergoba', 'Dyernina', 'Iltazyara', 'Murnyethara', 'Stayanoga', 'Ulmokina']
            },
            'Shou': {
                'Male': ['An', 'Chen', 'Chi', 'Fai', 'Jiang', 'Jun', 'Lian', 'Long', 'Meng', 'On', 'Shan', 'Shui', 'Wen'],
                'Female': ['Bai', 'Chao', 'Jia', 'Lei', 'Mei', 'Qiao', 'Shui', 'Tai'],
                'Surname': ['Chien', 'Huang', 'Kao', 'Kung', 'Lao', 'Ling', 'Mei', 'Pin', 'Shin', 'Sum', 'Tan', 'Wan']
            },
            'Tethyrian': {
                'Male': ['Darvin', 'Dorn', 'Evendur', 'Gorstag', 'Grim', 'Helm', 'Malark', 'Morn', 'Randal', 'Stedd'],
                'Female': ['Arveene', 'Esvele', 'Jhessail', 'Kerri', 'Lureene', 'Miri', 'Rowan', 'Shandri', 'Tessele'],
                'Surname': ['Amblecrown', 'Buckman', 'Dundragon', 'Evenwood', 'Greycastle', 'Tallstag']
            },
            'Turami': {
                'Male': ['Anton', 'Diero', 'Marcon', 'Pieron', 'Rimardo', 'Romero', 'Salazar', 'Umbero'],
                'Female': ['Balama', 'Dona', 'Faila', 'Jalana', 'Luisa', 'Marta', 'Quara', 'Selise', 'Vonda'],
                'Surname': ['Agosto', 'Astorio', 'Calabra', 'Domine', 'Falone', 'Marivaldi', 'Pisacar', 'Ramondo']
            }
        },
        'Dragonborn': {
            'Male': ['Arjhan', 'Balasar', 'Bharash', 'Donaar', 'Ghesh', 'Heskan', 'Kriv', 'Medrash', 'Mehen', 'Nadarr', 'Pandjed', 'Patrin', 'Rhogar', 'Shamash', 'Shedinn', 'Tarhun', 'Torinn'],
            'Female': ['Akra', 'Biri', 'Daar', 'Farideh', 'Harann', 'Havilar', 'Jheri', 'Kava', 'Korinn', 'Mishann', 'Nala', 'Perra', 'Raiann', 'Sora', 'Surina', 'Thava', 'Uadjit'],
            'Family': ['Clethtinthiallor', 'Daardendrian', 'Delmirev', 'Drachedandion', 'Fenkenkabradon', 'Kepeshkmolik', 'Kerrhylon', 'Kimbatuul', 'Linxakasendalor', 'Myastan', 'Nemmonis', 'Norixius', 'Ophinshtalajiir', 'Prexijandilin', 'Shestendeliath', 'Turnuroth', 'Verthisathurgiesh', 'Yarjerit']
        },
        'Gnome': {
            'Male': ['Alston', 'Alvyn', 'Boddynock', 'Brocc', 'Burgell', 'Dimble', 'Eldon', 'Erky', 'Fonkin', 'Frug', 'Gerbo', 'Gimble', 'Glim', 'Jebeddo', 'Kellen', 'Namfoodle', 'Orryn', 'Roondar', 'Seebo', 'Sindri', 'Warryn', 'Wrenn', 'Zook'],
            'Female': ['Bimpnottin', 'Breena', 'Caramip', 'Carlin', 'Donella', 'Duvamil', 'Ella', 'Ellyjobell', 'Ellywick', 'Lilli', 'Loopmottin', 'Lorilla', 'Mardnab', 'Nissa', 'Nyx', 'Oda', 'Orla', 'Roywyn', 'Shamil', 'Tana', 'Waywocket', 'Zanna'],
            'Nicknames': ['Aleslosh', 'Ashhearth', 'Badger', 'Cloak', 'Doublelock', 'Filchbatter', 'Fnipper', 'Ku', 'Nim', 'Oneshoe', 'Pock', 'Sparklegem', 'Stumbleduck'],
            'Family': ['Beren', 'Daergel', 'Folkor', 'Garrick', 'Nackle', 'Murnig', 'Ningel', 'Raulnor', 'Scheppen', 'Timbers', 'Turen']
        },
        'Half-Orc': {
            'Male': ['Dench', 'Feng', 'Gell', 'Henk', 'Holg', 'Imsh', 'Keth', 'Krusk', 'Mhurren', 'Ront', 'Shump', 'Thokk'],
            'Female': ['Baggi', 'Emen', 'Engong', 'Kansif', 'Myev', 'Neega', 'Ovak', 'Ownka', 'Shautha', 'Sutha', 'Vola', 'Volen', 'Yevelda']
        },
        'Tiefling': {
            'Male': ['Akmenos', 'Amnon', 'Barakas', 'Damakos', 'Ekemon', 'Iados', 'Kairon', 'Leucis', 'Melech', 'Mordai', 'Morthos', 'Pelaios', 'Skamos', 'Therai'],
            'Female': ['Akta', 'Anakis', 'Bryseis', 'Criella', 'Damaia', 'Ea', 'Kallista', 'Lerissa', 'Makaria', 'Nemeia', 'Orianna', 'Phelaia', 'Rieta']
        }
    };

    if (race === 'Human') {
        const cultures = Object.keys(names['Human']);
        const culture = getRandom(cultures);
        const first = getRandom(names['Human'][culture][gender]);
        const last = getRandom(names['Human'][culture].Surname);
        name = `${first} ${last}`;
    } else if (race === 'Gnome') {
        const first = getRandom(names['Gnome'][gender]);
        const nick = getRandom(names['Gnome'].Nicknames);
        const fam = getRandom(names['Gnome'].Family);
        name = `${first} (${nick}) ${fam}`;
    } else if (race === 'Half-Elf') {
        // choose either Elf-like or Human-like
        if (Math.random() < 0.5) {
            const first = getRandom(names['Elf'][gender]);
            const fam = getRandom(names['Elf'].Family);
            name = `${first} ${fam}`;
        } else {
            const cultures = Object.keys(names['Human']);
            const culture = getRandom(cultures);
            const first = getRandom(names['Human'][culture][gender]);
            const last = getRandom(names['Human'][culture].Surname);
            name = `${first} ${last}`;
        }
    } else {
        if (!names[race]) {
            name = `${race}ling`;
        } else {
            const first = getRandom(names[race][gender] || names[race].Male || names[race].Female);
            const fam = getRandom(names[race].Family || []);
            name = fam ? `${first} ${fam}` : first;
        }
    }
    return name;
}
function getStats(race) {
    let stats = {
        STR: rollStat(),
        DEX: rollStat(),
        CON: rollStat(),
        INT: rollStat(),
        WIS: rollStat(),
        CHA: rollStat(),
    }
    // Handle standard races (strings)
    if (race === 'Dragonborn') {
        stats.STR += 2;
        stats.CHA += 1;
    }
    else if (race === 'Human') {
        stats.STR += 1;
        stats.DEX += 1;
        stats.CON += 1;
        stats.INT += 1;
        stats.WIS += 1;
        stats.CHA += 1;
    }
    else if (race === 'Half-Orc') {
        stats.STR += 2;
        stats.CON += 1;
    }
    else if (race === 'Tiefling') {
        stats.CHA += 2;
        stats.INT += 1;
    }

    // Handle charSubraces — assume race can be an object like { Elf: "High Elf" }
    else if (typeof race === 'object') {
        if (race.Dwarf === 'Hill Dwarf') {
            stats.CON += 2;
            stats.WIS += 1;
        } else if (race.Dwarf === 'Mountain Dwarf') {
            stats.CON += 2;
            stats.STR += 2;
        } else if (race.Elf === 'High Elf') {
            stats.DEX += 2;
            stats.INT += 1;
        } else if (race.Elf === 'Dark Elf (Drow)') {
            stats.DEX += 2;
            stats.CHA += 1;
        } else if (race.Elf === 'Wood Elf') {
            stats.DEX += 2;
            stats.WIS += 1;
        } else if (race.Halfling === 'Lightfoot Halfling') {
            stats.DEX += 2;
            stats.CHA += 1;
        } else if (race.Halfling === 'Stout Halfling') {
            stats.DEX += 2;
            stats.CON += 1;
        } else if (race.Gnome === 'Rock Gnome') {
            stats.INT += 2;
            stats.CON += 1;
        } else if (race.Gnome === 'Forest Gnome') {
            stats.INT += 2;
            stats.DEX += 1;
        }
    }

    // Handle special case: Half-Elf
    else if (race === 'Half-Elf') {
        stats.CHA += 2;
        const statKeys = Object.keys(stats);
        const stat1 = statKeys[Math.floor(Math.random() * statKeys.length)];
        let stat2;
        do {
            stat2 = statKeys[Math.floor(Math.random() * statKeys.length)];
        } while (stat2 === stat1);
        stats[stat1] += 1;
        stats[stat2] += 1;
    }
    return stats;
}
function getSkillProficiencies(Class, background, race) {
    const skills = ['Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine', 'Nature', 'Perception', 'Performance', 'Persuasion', 'Religion', 'Sleight of Hand', 'Stealth', 'Survival'];
    let skillProficienciesTrue = [];
    let skillsProficient = {
        'Acrobatics': false,
        'Animal Handling': false,
        'Arcana': false,
        'Athletics': false,
        'Deception': false,
        'History': false,
        'Insight': false,
        'Intimidation': false,
        'Investigation': false,
        'Medicine': false,
        'Nature': false,
        'Perception': false,
        'Performance': false,
        'Persuasion': false,
        'Religion': false,
        'Sleight of Hand': false,
        'Stealth': false,
        'Survival': false
    };
    if (Class == 'Artificer') {
        const chose = ['Arcana', 'History', 'Investigation', 'Medicine', 'Nature', 'Perception', 'Sleight of Hand'];
        const choice1 = chose[Math.floor(Math.random() * chose.length)];
        const choice2 = chose.filter(skill => skill != choice1)[Math.floor(Math.random() * (chose.length - 1))];
        skillProficienciesTrue.push(choice1, choice2);
    } else if (Class == 'Barbarian') {
        const chose = ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'];
        const choice1 = chose[Math.floor(Math.random() * chose.length)];
        const choice2 = chose.filter(skill => skill != choice1)[Math.floor(Math.random() * (chose.length - 1))];
        skillProficienciesTrue.push(choice1, choice2);
    } else if (Class == 'Bard') {
        const choice1 = skills[Math.floor(Math.random() * skills.length)];
        const choice2 = skills.filter(skill => skill != choice1)[Math.floor(Math.random() * (skills.length - 1))];
        const choice3 = skills.filter(skill => skill != (choice1 || choice2))[Math.floor(Math.random() * (skills.length - 2))];
        skillProficienciesTrue.push(choice1, choice2, choice3);
    } else if (Class == 'Cleric') {
        const chose = ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'];
        const choice1 = chose[Math.floor(Math.random() * chose.length)];
        const choice2 = chose.filter(skill => skill != choice1)[Math.floor(Math.random() * (chose.length - 1))];
        skillProficienciesTrue.push(choice1, choice2);
    } else if (Class == 'Druid') {
        const chose = ['Arcana', 'Animal Handling', 'Insight, Medicine', 'Nature', 'Perception', 'Religion', 'Survival'];
        const choice1 = chose[Math.floor(Math.random() * chose.length)];
        const choice2 = chose.filter(skill => skill != choice1)[Math.floor(Math.random() * (chose.length - 1))];
        skillProficienciesTrue.push(choice1, choice2);
    } else if (Class == 'Fighter') {
        const chose = ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'];
        const choice1 = chose[Math.floor(Math.random() * chose.length)];
        const choice2 = chose.filter(skill => skill != choice1)[Math.floor(Math.random() * (chose.length - 1))];
        skillProficienciesTrue.push(choice1, choice2);
    } else if (Class == 'Monk') {
        const chose = ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'];
        const choice1 = chose[Math.floor(Math.random() * chose.length)];
        const choice2 = chose.filter(skill => skill != choice1)[Math.floor(Math.random() * (chose.length - 1))];
        skillProficienciesTrue.push(choice1, choice2);
    } else if (Class == 'Paladin') {
        const chose = ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'];
        const choice1 = chose[Math.floor(Math.random() * chose.length)];
        const choice2 = chose.filter(skill => skill != choice1)[Math.floor(Math.random() * (chose.length - 1))];
        skillProficienciesTrue.push(choice1, choice2);
    } else if (Class == 'Ranger') {
        const chose = ['Perception', 'Stealth', 'Survival', 'Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature'];
        const choice1 = chose[Math.floor(Math.random() * chose.length)];
        const choice2 = chose.filter(skill => skill != choice1)[Math.floor(Math.random() * (chose.length - 1))];
        const choice3 = chose.filter(skill => skill != (choice1 || choice2))[Math.floor(Math.random() * (chose.length - 2))];
        skillProficienciesTrue.push(choice1, choice2, choice3);
    } else if (Class == 'Rogue') {
        const chose = ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'];
        const choice1 = chose[Math.floor(Math.random() * chose.length)];
        const choice2 = chose.filter(skill => skill != choice1)[Math.floor(Math.random() * (chose.length - 1))];
        const choice3 = chose.filter(skill => skill != (choice1 || choice2))[Math.floor(Math.random() * (chose.length - 2))];
        const choice4 = chose.filter(skill => skill != (choice1 || choice2 || choice3))[Math.floor(Math.random() * (chose.length - 3))];
        skillProficienciesTrue.push(choice1, choice2, choice3, choice4);
    } else if (Class == 'Sorcerer') {
        const chose = ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'];
        const choice1 = chose[Math.floor(Math.random() * chose.length)];
        const choice2 = chose.filter(skill => skill != choice1)[Math.floor(Math.random() * (chose.length - 1))];
        skillProficienciesTrue.push(choice1, choice2);
    } else if (Class == 'Warlock') {
        const chose = ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'];
        const choice1 = chose[Math.floor(Math.random() * chose.length)];
        const choice2 = chose.filter(skill => skill != choice1)[Math.floor(Math.random() * (chose.length - 1))];
        skillProficienciesTrue.push(choice1, choice2);
    } else if (Class == 'Wizard') {
        const chose = ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'];
        const choice1 = chose[Math.floor(Math.random() * chose.length)];
        const choice2 = chose.filter(skill => skill != choice1)[Math.floor(Math.random() * (chose.length - 1))];
        skillProficienciesTrue.push(choice1, choice2);
    }

    if (background == 'Acolyte') {
        if (skillProficienciesTrue.includes('Insight' || 'Religion')) {
            const skill = skills.filter(skill => skill != skillProficienciesTrue)[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length))];
            skillProficienciesTrue.push(skill);
        } else if (skillProficienciesTrue.includes('Insight' && 'Religion')) {
            const skill1 = skills.filter(skill => skillProficienciesTrue.includes(skill) == false)[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length))];
            const skill2 = skills.filter(skill => (skillProficienciesTrue.includes(skill) == false && skill != skill1))[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length - 1))];
            skillProficienciesTrue.push(skill1, skill2);
        } else {
            skillProficienciesTrue.push('Insight', 'Religion');
        }
    } else if (background == 'Charlatan') {
        if (skillProficienciesTrue.includes('Deception' || 'Slight of Hand')) {
            const skill = skills.filter(skill => skill != skillProficienciesTrue)[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length))];
            skillProficienciesTrue.push(skill);
        } else if (skillProficienciesTrue.includes('Deception' && 'Slight of Hand')) {
            const skill1 = skills.filter(skill => skillProficienciesTrue.includes(skill) == false)[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length))];
            const skill2 = skills.filter(skill => (skillProficienciesTrue.includes(skill) == false && skill != skill1))[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length - 1))];
            skillProficienciesTrue.push(skill1, skill2);
        } else {
            skillProficienciesTrue.push('Deception', 'Slight of Hand');
        }
    } else if (background == 'Criminal') {
        if (skillProficienciesTrue.includes('Deception' || 'Stealth')) {
            const skill = skills.filter(skill => skill != skillProficienciesTrue)[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length))];
            skillProficienciesTrue.push(skill);
        } else if (skillProficienciesTrue.includes('Deception' && 'Stealth')) {
            const skill1 = skills.filter(skill => skillProficienciesTrue.includes(skill) == false)[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length))];
            const skill2 = skills.filter(skill => (skillProficienciesTrue.includes(skill) == false && skill != skill1))[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length - 1))];
            skillProficienciesTrue.push(skill1, skill2);
        } else {
            skillProficienciesTrue.push('Deception', 'Stealth');
        }
    } else if (background == 'Entertainer') {
        if (skillProficienciesTrue.includes('Acrobatics' || 'Performance')) {
            const skill = skills.filter(skill => skill != skillProficienciesTrue)[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length))];
            skillProficienciesTrue.push(skill);
        } else if (skillProficienciesTrue.includes('Acrobatics' && 'Performance')) {
            const skill1 = skills.filter(skill => skillProficienciesTrue.includes(skill) == false)[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length))];
            const skill2 = skills.filter(skill => (skillProficienciesTrue.includes(skill) == false && skill != skill1))[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length - 1))];
            skillProficienciesTrue.push(skill1, skill2);
        } else {
            skillProficienciesTrue.push('Acrobatics', 'Performance');
        }
    } else if (background == 'Folk Hero') {
        if (skillProficienciesTrue.includes('Animal Handling' || 'Survival')) {
            const skill = skills.filter(skill => skill != skillProficienciesTrue)[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length))];
            skillProficienciesTrue.push(skill);
        } else if (skillProficienciesTrue.includes('Animal Handling' && 'Survival')) {
            const skill1 = skills.filter(skill => skillProficienciesTrue.includes(skill) == false)[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length))];
            const skill2 = skills.filter(skill => (skillProficienciesTrue.includes(skill) == false && skill != skill1))[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length - 1))];
            skillProficienciesTrue.push(skill1, skill2);
        } else {
            skillProficienciesTrue.push('Animal Handling', 'Survival');
        }
    } else if (background == 'Guild Artisan') {
        if (skillProficienciesTrue.includes('Insight' || 'Persuasion')) {
            const skill = skills.filter(skill => skill != skillProficienciesTrue)[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length))];
            skillProficienciesTrue.push(skill);
        } else if (skillProficienciesTrue.includes('Insight' && 'Persuasion')) {
            const skill1 = skills.filter(skill => skillProficienciesTrue.includes(skill) == false)[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length))];
            const skill2 = skills.filter(skill => (skillProficienciesTrue.includes(skill) == false && skill != skill1))[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length - 1))];
            skillProficienciesTrue.push(skill1, skill2);
        } else {
            skillProficienciesTrue.push('Insight', 'Persuasion');
        }
    } else if (background == 'Hermit') {
        if (skillProficienciesTrue.includes('Medicine' || 'Religion')) {
            const skill = skills.filter(skill => skill != skillProficienciesTrue)[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length))];
            skillProficienciesTrue.push(skill);
        } else if (skillProficienciesTrue.includes('Medicine' && 'Religion')) {
            const skill1 = skills.filter(skill => skillProficienciesTrue.includes(skill) == false)[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length))];
            const skill2 = skills.filter(skill => (skillProficienciesTrue.includes(skill) == false && skill != skill1))[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length - 1))];
            skillProficienciesTrue.push(skill1, skill2);
        } else {
            skillProficienciesTrue.push('Medicine', 'Religion');
        }
    } else if (background == 'Noble') {
        if (skillProficienciesTrue.includes('History' || 'Persuasion')) {
            const skill = skills.filter(skill => skill != skillProficienciesTrue)[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length))];
            skillProficienciesTrue.push(skill);
        } else if (skillProficienciesTrue.includes('History' && 'Persuasion')) {
            const skill1 = skills.filter(skill => skillProficienciesTrue.includes(skill) == false)[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length))];
            const skill2 = skills.filter(skill => (skillProficienciesTrue.includes(skill) == false && skill != skill1))[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length - 1))];
            skillProficienciesTrue.push(skill1, skill2);
        } else {
            skillProficienciesTrue.push('History', 'Persuasion');
        }
    } else if (background == 'Outlander') {
        if (skillProficienciesTrue.includes('Athletics' || 'Survival')) {
            const skill = skills.filter(skill => skill != skillProficienciesTrue)[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length))];
            skillProficienciesTrue.push(skill);
        } else if (skillProficienciesTrue.includes('Athletics' && 'Survival')) {
            const skill1 = skills.filter(skill => skillProficienciesTrue.includes(skill) == false)[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length))];
            const skill2 = skills.filter(skill => (skillProficienciesTrue.includes(skill) == false && skill != skill1))[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length - 1))];
            skillProficienciesTrue.push(skill1, skill2);
        } else {
            skillProficienciesTrue.push('Athletics', 'Survival');
        }
    } else if (background == 'Sage') {
        if (skillProficienciesTrue.includes('Arcana' || 'History')) {
            const skill = skills.filter(skill => skill != skillProficienciesTrue)[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length))];
            skillProficienciesTrue.push(skill);
        } else if (skillProficienciesTrue.includes('Arcana' && 'History')) {
            const skill1 = skills.filter(skill => skillProficienciesTrue.includes(skill) == false)[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length))];
            const skill2 = skills.filter(skill => (skillProficienciesTrue.includes(skill) == false && skill != skill1))[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length - 1))];
            skillProficienciesTrue.push(skill1, skill2);
        } else {
            skillProficienciesTrue.push('Arcana', 'History');
        }
    } else if (background == 'Soldier') {
        if (skillProficienciesTrue.includes('Athletics' || 'Intimidation')) {
            const skill = skills.filter(skill => skill != skillProficienciesTrue)[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length))];
            skillProficienciesTrue.push(skill);
        } else if (skillProficienciesTrue.includes('Athletics' && 'Intimidation')) {
            const skill1 = skills.filter(skill => skillProficienciesTrue.includes(skill) == false)[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length))];
            const skill2 = skills.filter(skill => (skillProficienciesTrue.includes(skill) == false && skill != skill1))[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length - 1))];
            skillProficienciesTrue.push(skill1, skill2);
        } else {
            skillProficienciesTrue.push('Athletics', 'Intimidation');
        }
    } else if (background == 'Sailor') {
        if (skillProficienciesTrue.includes('Athletics' || 'Perception')) {
            const skill = skills.filter(skill => skill != skillProficienciesTrue)[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length))];
            skillProficienciesTrue.push(skill);
        } else if (skillProficienciesTrue.includes('Athletics' && 'Perception')) {
            const skill1 = skills.filter(skill => skillProficienciesTrue.includes(skill) == false)[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length))];
            const skill2 = skills.filter(skill => (skillProficienciesTrue.includes(skill) == false && skill != skill1))[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length - 1))];
            skillProficienciesTrue.push(skill1, skill2);
        } else {
            skillProficienciesTrue.push('Athletics', 'Perception');
        }
    } else if (background == 'Urchin') {
        if (skillProficienciesTrue.includes('Slight of Hand' || 'Stealth')) {
            const skill = skills.filter(skill => skill != skillProficienciesTrue)[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length))];
            skillProficienciesTrue.push(skill);
        } else if (skillProficienciesTrue.includes('Slight of Hand' && 'Stealth')) {
            const skill1 = skills.filter(skill => skillProficienciesTrue.includes(skill) == false)[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length))];
            const skill2 = skills.filter(skill => (skillProficienciesTrue.includes(skill) == false && skill != skill1))[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length - 1))];
            skillProficienciesTrue.push(skill1, skill2);
        } else {
            skillProficienciesTrue.push('Slight of Hand', 'Stealth');
        }
    }
    if (race == 'Half-Elf') {
        const skill1 = skills.filter(skill => skillProficienciesTrue.includes(skill) == false)[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length))];
        const skill2 = skills.filter(skill => (skillProficienciesTrue.includes(skill) == false && skill != skill1))[Math.floor(Math.random() * (skills.length - skillProficienciesTrue.length - 1))];
        skillProficienciesTrue.push(skill1, skill2);
    }

    Object.keys(skillsProficient).forEach(skillName => {
        // If the 'skillsToActivate' list includes the 'skillName'
        if (skillProficienciesTrue.includes(skillName)) {
            skillsProficient[skillName] = true;
        } else {
            skillsProficient[skillName] = false;
        }
    });
    return skillsProficient;
}
function getSkillModifiers(modifiers, proficient) {
    const skills = {
        'Acrobatics': 'DEX',
        'Animal Handling': 'WIS',
        'Arcana': 'INT',
        'Athletics': 'STR',
        'Deception': 'CHA',
        'History': 'INT',
        'Insight': 'WIS',
        'Intimidation': 'CHA',
        'Investigation': 'INT',
        'Medicine': 'WIS',
        'Nature': 'INT',
        'Perception': 'WIS',
        'Performance': 'CHA',
        'Persuasion': 'CHA',
        'Religion': 'INT',
        'Sleight of Hand': 'DEX',
        'Stealth': 'DEX',
        'Survival': 'STR'
    }
    const skillMods = {
        'Acrobatics': 0,
        'Animal Handling': 0,
        'Arcana': 0,
        'Athletics': 0,
        'Deception': 0,
        'History': 0,
        'Insight': 0,
        'Intimidation': 0,
        'Investigation': 0,
        'Medicine': 0,
        'Nature': 0,
        'Perception': 0,
        'Performance': 0,
        'Persuasion': 0,
        'Religion': 0,
        'Sleight of Hand': 0,
        'Stealth': 0,
        'Survival': 0
    }
    Object.keys(skills).forEach(skillName => {
        const ability = skills[skillName]; // e.g. 'DEX' for Acrobatics
        const baseMod = modifiers[ability]; // e.g. modifiers.DEX
        if (proficient[skillName]) {
            skillMods[skillName] = baseMod + profBonus;
        } else {
            skillMods[skillName] = baseMod;
        }
    });
    return skillMods;
}
function getProficiencies(Class, background) {
    let profs = [];
    const classProfs = {
        'Barbarian': {
            armor: ['Light armor', 'Medium armor', 'Shields'],
            weapons: ['Simple weapons', 'Martial weapons'],
            tools: [],
            saves: ['Strength', 'Constitution']
        },
        'Bard': {
            armor: ['Light armor'],
            weapons: ['Simple weapons', 'Hand crossbows', 'Longswords', 'Rapiers', 'Shortswords'],
            tools: ['Three musical instruments of your choice'],
            saves: ['Dexterity', 'Charisma']
        },
        'Cleric': {
            armor: ['Light armor', 'Medium armor', 'Shields'],
            weapons: ['Simple weapons'],
            tools: [],
            saves: ['Wisdom', 'Charisma']
        },
        'Druid': {
            armor: ['Light armor', 'Medium armor', 'Shields (nonmetal)'],
            weapons: ['Clubs', 'Daggers', 'Darts', 'Javelins', 'Maces', 'Quarterstaffs', 'Scimitars', 'Sickles', 'Slings', 'Spears'],
            tools: ['Herbalism kit'],
            saves: ['Intelligence', 'Wisdom']
        },
        'Fighter': {
            armor: ['All armor', 'Shields'],
            weapons: ['Simple weapons', 'Martial weapons'],
            tools: [],
            saves: ['Strength', 'Constitution']
        },
        'Monk': {
            armor: [],
            weapons: ['Simple weapons', 'Shortswords'],
            tools: ['One type of artisan\'s tools or one musical instrument'],
            saves: ['Strength', 'Dexterity']
        },
        'Paladin': {
            armor: ['All armor', 'Shields'],
            weapons: ['Simple weapons', 'Martial weapons'],
            tools: [],
            saves: ['Wisdom', 'Charisma']
        },
        'Ranger': {
            armor: ['Light armor', 'Medium armor', 'Shields'],
            weapons: ['Simple weapons', 'Martial weapons'],
            tools: [],
            saves: ['Strength', 'Dexterity']
        },
        'Rogue': {
            armor: ['Light armor'],
            weapons: ['Simple weapons', 'Hand crossbows', 'Longswords', 'Rapiers', 'Shortswords'],
            tools: ['Thieves\' tools'],
            saves: ['Dexterity', 'Intelligence']
        },
        'Sorcerer': {
            armor: [],
            weapons: ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Light crossbows'],
            tools: [],
            saves: ['Constitution', 'Charisma']
        },
        'Warlock': {
            armor: ['Light armor'],
            weapons: ['Simple weapons'],
            tools: [],
            saves: ['Wisdom', 'Charisma']
        },
        'Wizard': {
            armor: [],
            weapons: ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Light crossbows'],
            tools: [],
            saves: ['Intelligence', 'Wisdom']
        },
        'Artificer': {
            armor: ['Light armor', 'Medium armor', 'Shields'],
            weapons: ['Simple weapons'],
            tools: ['Thieves\' tools', 'Tinker\'s tools', 'One type of artisan\'s tools of your choice'],
            saves: ['Constitution', 'Intelligence']
        }
    };

    const backgroundProfs = {
        'Acolyte': [],
        'Charlatan': ['Disguise kit', 'Forgery kit'],
        'Criminal': ['One type of gaming set', 'Thieves\' tools'],
        'Entertainer': ['Disguise kit', 'One musical instrument'],
        'Folk Hero': ['One type of artisan\'s tools', 'Vehicles (land)'],
        'Guild Artisan': ['One type of artisan\'s tools'],
        'Hermit': ['Herbalism kit'],
        'Noble': ['One type of gaming set'],
        'Outlander': ['One musical instrument'],
        'Sage': [],
        'Sailor': ['Navigator\'s tools', 'Vehicles (water)'],
        'Soldier': ['One type of gaming set', 'Vehicles (land)'],
        'Urchin': ['Disguise kit', 'Thieves\' tools']
    };
    profs.push(classProfs[Class], backgroundProfs[background]);
    const prof = profs.join(', ');
    return prof;
}
function getLanguages(background, Class, race, subrace, subclass = null) {
    let languagesKnown = [];

    // Base languages for races
    const baseLanguages = {
        'Dwarf': ['Common', 'Dwarvish'],
        'Elf': ['Common', 'Elvish'],
        'Halfling': ['Common', 'Halfling'],
        'Human': ['Common'],
        'Dragonborn': ['Common', 'Draconic'],
        'Gnome': ['Common', 'Gnomish'],
        'Half-Elf': ['Common', 'Elvish'],
        'Half-Orc': ['Common', 'Orc'],
        'Tiefling': ['Common', 'Infernal']
    };

    // Subrace-specific languages
    const subraceLanguages = {
        'High Elf': ['Elvish', 'Extra'],
        'Wood Elf': ['Elvish'],
        'Dark Elf (Drow)': ['Elvish'],
        'Rock Gnome': ['Gnomish'],
        'Forest Gnome': ['Gnomish']
    };

    // Helper function to get a random language not already known
    function getRandomLanguage(exclude = []) {
        const options = languages.filter(function(lang) {
            return !languagesKnown.includes(lang) && !exclude.includes(lang);
        });
        if (options.length === 0) return null; // nothing left to pick
        const randomIndex = Math.floor(Math.random() * options.length);
        return options[randomIndex];
    }

    // Add race/subrace languages
    if (subrace && subraceLanguages[subrace]) {
        subraceLanguages[subrace].forEach(function(lang) {
            if (lang === 'Extra') {
                const randomLang = getRandomLanguage(['Elvish']);
                if (randomLang) languagesKnown.push(randomLang);
            } else {
                languagesKnown.push(lang);
            }
        });
    } else if (baseLanguages[race]) {
        languagesKnown.push(...baseLanguages[race]);
    }

    // Class-specific languages
    if (Class === 'Druid') {
        languagesKnown.push('Druidic');
        if (subclass === 'Circle of the Shepherd') {
            languagesKnown.push('Sylvan');
        }
    } else if (Class === 'Cleric' && subclass === 'Knowledge Domain') {
        const lang1 = getRandomLanguage();
        const lang2 = getRandomLanguage([lang1]);
        if (lang1) languagesKnown.push(lang1);
        if (lang2) languagesKnown.push(lang2);
    } else if (Class === 'Rogue' && subclass === 'Mastermind') {
        const lang1 = getRandomLanguage();
        const lang2 = getRandomLanguage([lang1]);
        if (lang1) languagesKnown.push(lang1);
        if (lang2) languagesKnown.push(lang2);
    } else if (Class === 'Ranger') {
        // Assume preferredEnemiesLang is an object mapping enemies to their languages
        if (typeof preferredEnemiesLang !== 'undefined') {
            const enemyKeys = Object.keys(preferredEnemiesLang);
            const chosenEnemy = enemyKeys[Math.floor(Math.random() * enemyKeys.length)];
            const enemyLangs = preferredEnemiesLang[chosenEnemy].filter(function(lang) {
                return !languagesKnown.includes(lang);
            });
            if (enemyLangs.length > 0) languagesKnown.push(enemyLangs[Math.floor(Math.random() * enemyLangs.length)]);
        }
    } else if (Class === 'Monk') {
        // Monks at high level can know all languages
        languages.forEach(function(lang) {
            if (!languagesKnown.includes(lang)) {
                languagesKnown.push(lang);
            }
        });
    } else if (Class === 'Fighter' && subclass === 'Cavalier') {
        const lang = getRandomLanguage();
        if (lang) languagesKnown.push(lang);
    }

    // Background-specific languages
    if (['Acolyte', 'Sage'].includes(background)) {
        const lang1 = getRandomLanguage();
        const lang2 = getRandomLanguage([lang1]);
        if (lang1) languagesKnown.push(lang1);
        if (lang2) languagesKnown.push(lang2);
    } else if (['Guild Artisan', 'Hermit', 'Noble', 'Outlander'].includes(background)) {
        const lang = getRandomLanguage();
        if (lang) languagesKnown.push(lang);
    }

    // Return unique languages
    return [...new Set(languagesKnown)];
}
function getHealthPoints(Class, conScore) {
    const classHitDie = {
        'Fighter': 10,
        'Wizard': 6,
        'Cleric': 8,
        'Rogue': 8,
        'Barbarian': 12,
        'Bard': 8,
        'Druid': 8,
        'Monk': 8,
        'Paladin': 10,
        'Ranger': 10,
        'Sorcerer': 6,
        'Warlock': 8
    };
    const hitDie = classHitDie[Class] || 8;
    return hitDie + conScore;
}
function getHitDice(Class) {
    const classHitDie = {
        'Fighter': 10,
        'Wizard': 6,
        'Cleric': 8,
        'Rogue': 8,
        'Barbarian': 12,
        'Bard': 8,
        'Druid': 8,
        'Monk': 8,
        'Paladin': 10,
        'Ranger': 10,
        'Sorcerer': 6,
        'Warlock': 8
    };
    return 'd' + classHitDie[Class];
}
function getArmor(Class) {
    const armorA = {
        'Barbarian': 'Hide',
        'Bard': 'Leather',
        'Cleric': 'Scale Mail',
        'Druid': 'Leather',
        'Fighter': 'Chain Mail',
        'Monk': 'None',
        'Paladin': ['Chain Mail', 'Shield'],
        'Ranger': 'Leather',
        'Rogue': 'Leather',
        'Sorcerer': 'None',
        'Warlock': 'None',
        'Wizard': 'Leather'
    };
    const armorB = {
        'Barbarian': 'None',
        'Bard': 'Leather',
        'Cleric': 'Leather',
        'Druid': 'Shield',
        'Fighter': 'Leather',
        'Monk': 'None',
        'Paladin': 'Chain Mail',
        'Ranger': 'Scale Mail',
        'Rogue': 'Leather',
        'Sorcerer': 'None',
        'Warlock': 'None',
        'Wizard': 'Leather'
    };
    const armorC = {
        'Cleric': ['Chain Mail', 'Sheild']
    }

    if (Math.random(1, 3) == 1) {
        return armorA[Class];
    } else if (Math.random(1, 3) == 2) {
        return armorB[Class];
    } else {
        if (armorC[Class] === undefined) {
            if (Math.random() < 0.5) {
                return armorA[Class];
            } else {
                return armorB[Class];
            }
        }
        return armorC[Class];
    }
}
function getArmorClass(Class, armor, dexScore, wisScore, conScore) {
    let armorClass = 0;
    const armorTypes = {
        'padded': 11,
        'leather': 11,
        'studded': 12,
        'hide': 12,
        'chain shirt': 13,
        'scale mail': 14,
        'breastplate': 14,
        'half plate': 15,
        'ring mail': 14,
        'chain mail': 16,
        'splint': 17,
        'plate': 18,
        'shield': +2
    };
    if (Class == 'Monk') {
        armorClass = 10 + dexScore + wisScore;
    } else if (Class == 'Barbarian') {
        armorClass = 10 + dexScore + conScore;
    } else {
        const armorBonus = armorTypes[armor] || 10;
        armorClass = armorBonus + dexScore;
    }
    // Additional logic for armor can be added here
    return armorClass;
}
function getSpeed(race) {
    const speeds = {
        'Dwarf': '25ft',
        'Elf': '30ft',
        'Halfling': '25ft',
        'Human': '30ft',
        'Dragonborn': '30ft',
        'Gnome': '25ft',
        'Half-Elf': '30ft',
        'Half-Orc': '30ft',
        'Tiefling': '30ft',
    }
    return speeds[race];
}
function getEquipment(Class, background) {
    let equipments = [];

    const martialWeapon = martialWeapons[Math.floor(Math.random() * martialWeapons.length)];
    const simpleWeapon = simpleWeapons[Math.floor(Math.random() * simpleWeapons.length)];
    const simpleMeleeWeapon = simpleMelees[Math.floor(Math.random() * simpleMelees.length)];
    const instrument = instruments[Math.floor(Math.random() * instruments.length)];
    const arcaneFocus = arcaneFocuses[Math.floor(Math.random() * arcaneFocuses.length)];
    const charlatanTool = charlatanTools[Math.floor(Math.random() * charlatanTools.length)];
    const artisanTool = artisansTools[Math.floor(Math.random() * artisansTools.length)];
    const trinket = trinkets[Math.floor(Math.random() * trinkets.length)];

    const backgroundEquipment = {
        'Acolyte': 'A holy symbol, a prayer book or prayer wheel, 5 sticks of incense, vestments, a set of common clothes, and a belt pouch containing 15 gp',
        'Charlatan': 'A set of fine clothes, a disguise kit, ' + charlatanTool + ', and a belt pouch containing 15 gp',
        'Criminal': 'A crowbar, a set of dark common clothes including a hood, and a belt pouch containing 15 gp',
        'Entertainer': instrument + ', the favor of an admirer (love letter, lock of hair, or trinket), a costume, fine clothes and a belt pouch containing 15 gp',
        'Folk Hero': artisanTool + ', a shovel, an iron pot, a set of common clothes, and a belt pouch containing 10 gp',
        'Guild Artisan': artisanTool + ', a letter of introduction from your guild, a set of traveler\'s clothes, and a belt pouch containing 15 gp',
        'Hermit': 'A scroll case stuffed full of notes from your studies or prayers, a winter blanket, a set of common clothes, an herbalism kit, and 5 gp',
        'Noble': 'A set of fine clothes, a signet ring, a scroll of pedigree, and a purse containing 25 gp',
        'Outlander': 'A staff, a hunting trap, a trophy from an animal you killed, a set of traveler\'s clothes, and a belt pouch containing 10 gp',
        'Sage': 'A bottle of black ink, a quill, a small knife, a letter from a dead colleague posing a question you have not yet been able to answer, a set of common clothes, and a belt pouch containing 10 gp',
        'Sailor': 'A belaying pin (club), 50 feet of silk rope, ' + trinket + ', a set of common clothes, and a belt pouch containing 10 gp',
        'Soldier': 'An insignia of rank, a trophy taken from a fallen enemy (a dagger, broken blade, or piece of a banner), a set of common clothes, and a belt pouch containing 10 gp',
        'Urchin': 'A small knife, a map of the city you grew up in, a pet mouse, a token to remember your parents by, a set of common clothes, and a belt pouch containing 10 gp'
    };

    equipments.push(backgroundEquipment[background]);


    const classEquipmentA = {
        'Barbarian': 'A greataxe, two handaxes, an explorer\'s pack, and four javelins',
        'Bard': 'A rapier, a lute, a diplomat\'s pack, leather armor, and a dagger',
        'Cleric': 'A mace, scale mail, a light crossbow with 20 bolts, a priest\'s pack, and a shield',
        'Druid': 'A wooden shield, a scimitar, leather armor, an explorer\'s pack, and a druidic focus',
        'Fighter': 'Chain Mail,' + martialWeapon + ', a Shield, a Light Crossbow with 20 bolts, and a dungeoneer\'s pack',
        'Monk': 'A shortsword, a dungeoneer\'s pack, and 10 darts',
        'Paladin': martialWeapon + ' and a shield, five javelins, preist\'s pack, chain mail, and a holy symbol',
        'Ranger': 'Scale mail, two shortswords, dungeoneer\'s pack, and a longbow with a quiver of 20 arrows',
        'Rogue': 'A rapier, a shortbow and quiver of 20 arrows, a burglar\'s pack, leather armor, two daggers, and thieves\' tools',
        'Sorcerer': 'A light crossbow and 20 bolts, a component pouch, two daggers, and an dungeoneer\'s pack',
        'Warlock': 'A light crossbow and 20 bolts, a component pouch, a scholar\'s pack, leather armor, ' + simpleWeapon + ', two daggers',
        'Wizard': 'A quarterstaff, a component pouch, a scholar\'s pack, and a spellbook'
    };
    const classEquipmentB = {
        'Barbarian': martialWeapon + ', ' + simpleWeapon + ', an explorer\'s pack, and four javelins',
        'Bard': 'A rapier, ' + instrument + ', a entertainer\'s pack, leather armor, and a dagger',
        'Cleric': 'A warhammer, leather armor,' + simpleWeapon + ', a explorer\'s pack, a shield, and a holy symbol',
        'Druid': simpleWeapon + simpleMeleeWeapon + ', leather armor, an explorer\'s pack, and a druidic focus',
        'Fighter': 'Leather armor, longbow with 20 arrows, two ' + martialWeapon + ', two handaxes, and an explorer\'s pack',
        'Monk': simpleWeapon + ', a explorer\'s pack, and 10 darts',
        'Paladin': 'Two ' + martialWeapon + ', ' + simpleMeleeWeapon + ', an explorer\'s pack, chain mail, and a holy symbol',
        'Ranger': 'Leather armor, two ' + simpleMeleeWeapon + ', an explorer\'s pack, and a longbow with a quiver of 20 arrows',
        'Rogue': 'Two shortswords, a dungeoneer\'s pack, leather armor, and two daggers, and theives\' tools',
        'Sorcerer': simpleWeapon + ', ' + arcaneFocus + ', two daggers, and an explorer\'s pack',
        'Warlock': simpleWeapon + ', ' + arcaneFocus + ', a dungeoneer\'s pack, leather armor, ' + simpleWeapon + ', two daggers',
        'Wizard': 'A dagger, ' + arcaneFocus + ', a explorer\'s pack, and a spellbook'
    }
    const classEquipmentC = {
        'Bard': simpleWeapon + ', ' + instrument + ', a entertainer\'s pack, leather armor, and a dagger',
        'Cleric': 'A warhammer, chain mail,' + simpleWeapon + ', a explorer\'s pack, a shield, and a holy symbol',
        'Rogue': 'Two shortswords, an explorer\s pack, leather armor, two daggers, and thieves\' tools',
    }
    if (Math.random(1, 3) == 1) {
        equipments.push(classEquipmentA[Class]);
    } else if (Math.random(1, 3) == 2) {
        equipments.push(classEquipmentB[Class])
    } else {
        if (classEquipmentC[Class] === undefined) {
            if (Math.random() < 0.5) {
                equipments.push(classEquipmentA[Class])
            } else {
                equipments.push(classEquipmentB[Class])
            }
        }
        equipments.push(classEquipmentC[Class])
    }
    const equipment = equipments.join(', ');
    return equipment;
}
function getFeatures(race, subrace, Class) {
    let featuresArray = [];
    const draconicAncestry = ['Black', 'Blue', 'Brass', 'Bronze', 'Copper', 'Gold', 'Green', 'Red', 'Silver', 'White'];

    const raceFeatures = {
        'Dwarf': {
            'Hill Dwarf': 'Darkvision, Dwarven Resilience, Dwarven Combat Training, Stonecunning, Dwarven Toughness',
            'Mountain Dwarf': 'Darkvision, Dwarven Resilience, Dwarven Combat Training, Stonecunning, Dwarven Armor Training'
        },
        'Elf': {
            'High Elf': 'Darkvision, Keen Senses, Fey Ancestry, Trance, Elf Weapon Training',
            'Wood Elf': 'Darkvision, Keen Senses, Fey Ancestry, Trance, Elf Weapon Training, Mask of the Wild',
            'Dark Elf (Drow)': 'Superior Darkvision, Keen Senses, Fey Ancestry, Trance, Sunlight Sensitivity, Drow Magic, Drow Weapon Training'
        },
        'Halfling': {
            'Lightfoot Halfling': 'Lucky, Brave, Halfling Nimbleness, Naturally Stealthy',
            'Stout Halfling': 'Lucky, Brave, Halfling Nimbleness, Stout Resilience',
        },
        'Human': '',
        'Dragonborn': 'Draconic Ancestry (' + draconicAncestry[Math.floor(Math.random() * draconicAncestry.length)] + '), Breath Weapon, Damage Resistance',
        'Gnome': {
            'Forest Gnome': 'Darkvision, Gnome Cunning, Natural Illusionist, Speak with Small Beasts',
            'Rock Gnome': 'Darkvision, Gnome Cunning, Artificer\'s Lore, Tinker',
        },
        'Half-Elf': 'Darkvision, Fey Ancestry',
        'Half-Orc': 'Darkvision, Menacing, Relentless Endurance, Savage Attacks',
        'Tiefling': 'Darkvision, Hellish Resistance, Infernal Legacy'
    };

    const classFeatures = {
        'Artificer': 'Magical Tinkering, Spellcasting',
        'Barbarian': 'Rage, Unarmored Defense',
        'Bard': 'Spellcasting, Bardic Inspiration (d6)',
        'Cleric': 'Spell Casting, Devine Domain',
        'Druid': 'Druidic, Spellcasting',
        'Fighter': 'Fighting Style, Second Wind',
        'Monk': 'Unarmored Defense, Martial Arts',
        'Paladin': 'Divine Sense, Lay on Hands',
        'Ranger': 'Favored Enemy, Natural Explorer',
        'Rogue': 'Expertise, Sneak Attack (d6), Theives\' Cant',
        'Sorcerer': 'Spellcasting, Sorcerous Origin',
        'Warlock': 'Otherworldly Patron, Pact Magic',
        'Wizard': 'Spellcasting, Arcane Recovery',
    };

    // Add race and subrace features
    if (raceFeatures[race]) {
        if (typeof raceFeatures[race] === 'string') {
            featuresArray.push(raceFeatures[race]); // for races like Dragonborn, Half-Elf, etc.
        } else if (subrace && raceFeatures[race][subrace]) {
            featuresArray.push(raceFeatures[race][subrace]); // for races with subraces
        }
    }

    // Add class features
    if (classFeatures[Class]) {
        featuresArray.push(classFeatures[Class]);
    }

    return featuresArray.join(", ");
}
function getAge(race) {
    const ranges = {
        Dwarf: [50, 350],
        Elf: [100, 750],
        Halfling: [20, 150],
        Human: [15, 90],
        Dragonborn: [15, 80],
        Gnome: [40, 500],
        "Half-Elf": [20, 180],
        "Half-Orc": [14, 75],
        Tiefling: [18, 120],
    };
    const [min, max] = ranges[race] || [20, 100];
    return Math.floor(Math.random() * (max - min) + min);
}
function getHeight(race) {
    const ranges = {
        Dwarf: [48, 60],
        Elf: [60, 78],
        Halfling: [30, 36],
        Human: [60, 78],
        Dragonborn: [66, 84],
        Gnome: [36, 42],
        "Half-Elf": [60, 78],
        "Half-Orc": [60, 78],
        Tiefling: [60, 78],
    };
    const [min, max] = ranges[race] || [60, 72];
    const inches = Math.floor(Math.random() * (max - min) + min);
    const feet = Math.floor(inches / 12);
    const inchPart = inches % 12;
    return `${feet}'${inchPart}"`;
}
function getWeight(race) {
    const weights = {
        'Dwarf': '150 lb',
        'Elf': Math.floor(Math.random() * (145 - 90) + 90) + ' lb',
        'Halfling': Math.floor(Math.random * (45 - 35) + 35) + ' lb',
        'Human': Math.floor(Math.random * (250 - 125) + 125) + ' lb',
        'Dragonborn': Math.floor(Math.random * (360 - 175) + 175) + ' lb',
        'Gnome': Math.floor(Math.random * (45 - 35) + 35) + ' lb',
        'Half-Elf': Math.floor(Math.random * (180 - 100) + 100) + ' lb',
        'Half-Orc': Math.floor(Math.random * (225 - 155) + 155) + ' lb',
        'Tiefling': Math.floor(Math.random * (220 - 135) + 135) + ' lb'
    }
    return weights[race];
}
function getSpells(Class) {
    let spells = {
        'cantrips': [],
        'spells': []
    }
    if (['Warlock', 'Ranger', 'Druid', 'Artificer'].includes(Class)) {
        const cantrip1 = allSpells[Class]['cantrips'][Math.floor(Math.random() * allSpells[Class]['cantrips'].length)];
        const cantrip2 = allSpells[Class]['cantrips'].filter(cantrip => cantrip != cantrip1)[Math.floor(Math.random() * (allSpells[Class]['cantrips'].length - 1))];
        const spell1 = allSpells[Class]['spells'][Math.floor(Math.random() * allSpells[Class]['spells'].length)];
        const spell2 = allSpells[Class]['spells'].filter(spell => spell != spell1)[Math.floor(Math.random() * (allSpells[Class]['spells'].length - 1))];

        spells['cantrips'].push(cantrip1, cantrip2);
        spells['spells'].push(spell1, spell2);
    } else if (Class == ('Wizard' || 'Cleric')) {
        const cantrip1 = allSpells[Class]['cantrips'][Math.floor(Math.random() * allSpells[Class]['cantrips'].length)];
        const cantrip2 = allSpells[Class]['cantrips'].filter(cantrip => cantrip != cantrip1)[Math.floor(Math.random() * (allSpells[Class]['cantrips'].length - 1))];
        const cantrip3 = allSpells[Class]['cantrips'].filter(cantrip => cantrip != (cantrip1 || cantrip2))[Math.floor(Math.random() * (allSpells[Class]['cantrips'].length - 2))];
        const spell1 = allSpells[Class]['spells'][Math.floor(Math.random() * allSpells[Class]['spells'].length)];
        const spell2 = allSpells[Class]['spells'].filter(spell => spell != spell1)[Math.floor(Math.random() * (allSpells[Class]['spells'].length - 1))];

        spells['cantrips'].push(cantrip1, cantrip2, cantrip3);
        spells['spells'].push(spell1, spell2);
    } else if (Class == ('Sorcerer')) {
        const cantrip1 = allSpells[Class]['cantrips'][Math.floor(Math.random() * allSpells[Class]['cantrips'].length)];
        const cantrip2 = allSpells[Class]['cantrips'].filter(cantrip => cantrip != cantrip1)[Math.floor(Math.random() * (allSpells[Class]['cantrips'].length - 1))];
        const cantrip3 = allSpells[Class]['cantrips'].filter(cantrip => cantrip != (cantrip1 || cantrip2))[Math.floor(Math.random() * (allSpells[Class]['cantrips'].length - 2))];
        const cantrip4 = allSpells[Class]['cantrips'].filter(cantrip => cantrip != (cantrip1 || cantrip2 || cantrip3))[Math.floor(Math.random() * (allSpells[Class]['cantrips'].length - 3))]
        const spell1 = allSpells[Class]['spells'][Math.floor(Math.random() * allSpells[Class]['spells'].length)];
        const spell2 = allSpells[Class]['spells'].filter(spell => spell != spell1)[Math.floor(Math.random() * (allSpells[Class]['spells'].length - 1))];

        spells['cantrips'].push(cantrip1, cantrip2, cantrip3, cantrip4);
        spells['spells'].push(spell1, spell2);
    } else if (Class == 'Bard') {
        const cantrip1 = allSpells[Class]['cantrips'][Math.floor(Math.random() * allSpells[Class]['cantrips'].length)];
        const cantrip2 = allSpells[Class]['cantrips'].filter(cantrip => cantrip != cantrip1)[Math.floor(Math.random() * (allSpells[Class]['cantrips'].length - 1))];
        const spell1 = allSpells[Class]['spells'][Math.floor(Math.random() * allSpells[Class]['spells'].length)];
        const spell2 = allSpells[Class]['spells'].filter(cantrip => cantrip != spell1)[Math.floor(Math.random() * (allSpells[Class]['spells'].length - 1))]
        const spell3 = allSpells[Class]['spells'].filter(spell => spell != (spell1 || spell2))[Math.floor(Math.random() * (allSpells[Class]['spells'].lengt - 2))];
        const spell4 = allSpells[Class]['spells'].filter(spell => spell != (spell1 || spell2 || spell3))[Math.floor(Math.random() * (allSpells[Class]['spells'].length - 3))];

        spells['cantrips'].push(cantrip1, cantrip2);
        spells['spells'].push(spell1, spell2, spell3, spell4);
    }
    return spells;
}
function getSpellClass(Class) {
    const spellClasses = {
        'Artificer': 'Artificer',
        'Barbarian': '',
        'Bard': 'Bard',
        'Cleric': 'Cleric',
        'Druid': 'Druid',
        'Fighter': '',
        'Monk': '',
        'Paladin': '',
        'Ranger': '',
        'Rogue': '',
        'Sorcerer': 'Sorcerer',
        'Warlock': 'Warlock',
        'Wizard': 'Wizard'
    }
    return spellClasses[Class]
}
function getSpellAbility(Class) {
    const spellAbilities = {
        'Artificer': 'INT',
        'Barbarian': '',
        'Bard': 'CHA',
        'Cleric': 'WIS',
        'Druid': 'WIS',
        'Fighter': '',
        'Monk': '',
        'Paladin': '',
        'Ranger': '',
        'Rogue': '',
        'Sorcerer': 'CHA',
        'Warlock': 'CHA',
        'Wizard': 'INT'
    }
    return spellAbilities[Class];
}
function getSpellDifficultyClass(Class, stats) {
    const DCs = {
        'Artificer': 8 + getMod(stats[getSpellAbility(Class)]) + 2,
        'Barbarian': '',
        'Bard': 8 + getMod(stats[getSpellAbility(Class)]) + 2,
        'Cleric': 8 + getMod(stats[getSpellAbility(Class)]) + 2,
        'Druid': 8 + getMod(stats[getSpellAbility(Class)]) + 2,
        'Fighter': '',
        'Monk': '',
        'Paladin': 8 + getMod(stats[getSpellAbility(Class)]) + 2,
        'Ranger': '',
        'Rogue': '',
        'Sorcerer': 8 + getMod(stats[getSpellAbility(Class)]) + 2,
        'Warlock': 8 + getMod(stats[getSpellAbility(Class)]) + 2,
        'Wizard': 8 + getMod(stats[getSpellAbility(Class)]) + 2
    }
    return DCs[Class];
}
function getSpellAttackBonus(Class, stats) {
    const ABs = {
        'Artificer': getMod(stats[getSpellAbility(Class)]) + 2,
        'Barbarian': '',
        'Bard': getMod(stats[getSpellAbility(Class)]) + 2,
        'Cleric': getMod(stats[getSpellAbility(Class)]) + 2,
        'Druid': getMod(stats[getSpellAbility(Class)]) + 2,
        'Fighter': '',
        'Monk': '',
        'Paladin': getMod(stats[getSpellAbility(Class)]) + 2,
        'Ranger': '',
        'Rogue': '',
        'Sorcerer': getMod(stats[getSpellAbility(Class)]) + 2,
        'Warlock': getMod(stats[getSpellAbility(Class)]) + 2,
        'Wizard': getMod(stats[getSpellAbility(Class)]) + 2
    }
    return ABs[Class];
}

//call
//generateCharacter().then(console.log).catch(console.error);