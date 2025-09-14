// 英語の格言と豆知識データ
export interface EnglishTip {
  id: number;
  type: 'quote' | 'tip';
  category: 'grammar' | 'vocabulary' | 'general';
  content: string;
  translation: string;
  explanation?: string;
}

export const englishTips: EnglishTip[] = [
  // 文法関連の格言
  {
    id: 1,
    type: 'quote',
    category: 'grammar',
    content: "Grammar is the grave of letters.",
    translation: "文法は文字の墓場である。",
    explanation: "マーク・トウェインの言葉。文法にこだわりすぎると、自然な表現力が失われるという意味。"
  },
  {
    id: 2,
    type: 'quote',
    category: 'grammar',
    content: "The limits of my language mean the limits of my world.",
    translation: "私の言語の限界が、私の世界の限界を意味する。",
    explanation: "哲学者ルートヴィヒ・ウィトゲンシュタインの言葉。言語が思考の枠組みを作ることを示している。"
  },
  {
    id: 3,
    type: 'tip',
    category: 'grammar',
    content: "English has no future tense!",
    translation: "英語には未来時制がない！",
    explanation: "英語では 'will' や 'going to' を使って未来を表現しますが、動詞の形自体は変わりません。"
  },
  {
    id: 4,
    type: 'tip',
    category: 'grammar',
    content: "The word 'set' has the most meanings in English.",
    translation: "「set」という単語が英語で最も多くの意味を持つ。",
    explanation: "Oxford English Dictionaryによると、'set'は464の異なる意味を持つ最も多義的な単語です。"
  },
  {
    id: 5,
    type: 'quote',
    category: 'grammar',
    content: "A language is a dialect with an army and navy.",
    translation: "言語とは、軍隊と海軍を持つ方言である。",
    explanation: "社会言語学者マックス・ワインライヒの言葉。政治的な力が言語の地位を決定することを示している。"
  },

  // 語彙関連の格言
  {
    id: 6,
    type: 'quote',
    category: 'vocabulary',
    content: "Words are, of course, the most powerful drug used by mankind.",
    translation: "言葉は、もちろん、人類が使用する最も強力な薬である。",
    explanation: "小説家ラドヤード・キップリングの言葉。言葉の影響力の大きさを表現している。"
  },
  {
    id: 7,
    type: 'tip',
    category: 'vocabulary',
    content: "English borrows from over 350 languages!",
    translation: "英語は350以上の言語から借用している！",
    explanation: "英語の語彙の約80%が他の言語から借用されたもので、特にラテン語、フランス語、ギリシャ語からの借用が多い。"
  },
  {
    id: 8,
    type: 'tip',
    category: 'vocabulary',
    content: "The longest English word is 45 letters long!",
    translation: "最も長い英語の単語は45文字！",
    explanation: "'pneumonoultramicroscopicsilicovolcanoconiosis'（塵肺症）が最も長い英単語として知られています。"
  },
  {
    id: 9,
    type: 'quote',
    category: 'vocabulary',
    content: "The difference between the right word and the almost right word is the difference between lightning and a lightning bug.",
    translation: "正しい単語とほぼ正しい単語の違いは、稲妻と蛍の違いである。",
    explanation: "マーク・トウェインの言葉。単語選択の重要性を強調している。"
  },
  {
    id: 10,
    type: 'tip',
    category: 'vocabulary',
    content: "Shakespeare invented over 1,700 words!",
    translation: "シェイクスピアは1,700以上の単語を発明した！",
    explanation: "'eyeball', 'swagger', 'lonely'など、現在も使われている多くの単語をシェイクスピアが初めて使用した。"
  },

  // 一般的な英語学習の格言
  {
    id: 11,
    type: 'quote',
    category: 'general',
    content: "The best way to learn a language is to speak it.",
    translation: "言語を学ぶ最良の方法は、それを話すことである。",
    explanation: "理論だけでなく、実際に使うことで言語は身につくという学習の基本原則。"
  },
  {
    id: 12,
    type: 'quote',
    category: 'general',
    content: "A different language is a different vision of life.",
    translation: "異なる言語は、異なる人生観である。",
    explanation: "映画監督フェデリコ・フェリーニの言葉。言語が世界観を形成することを示している。"
  },
  {
    id: 13,
    type: 'tip',
    category: 'general',
    content: "English is spoken by 1.5 billion people worldwide!",
    translation: "英語は世界中で15億人に話されている！",
    explanation: "世界人口の約20%が英語を話し、そのうち約4億人が母語として使用している。"
  },
  {
    id: 14,
    type: 'tip',
    category: 'general',
    content: "The word 'OK' comes from 'oll korrect'!",
    translation: "「OK」という単語は「oll korrect」から来ている！",
    explanation: "19世紀のアメリカで、'all correct'のスペルミス版として生まれた略語が定着した。"
  },
  {
    id: 15,
    type: 'quote',
    category: 'general',
    content: "If you talk to a man in a language he understands, that goes to his head. If you talk to him in his language, that goes to his heart.",
    translation: "人が理解する言語で話せば、それは頭に届く。その人の言語で話せば、それは心に届く。",
    explanation: "ネルソン・マンデラの言葉。母語で話すことの深い影響力を表現している。"
  },
  {
    id: 16,
    type: 'tip',
    category: 'general',
    content: "English has more words than any other language!",
    translation: "英語は他のどの言語よりも多くの単語を持つ！",
    explanation: "Oxford English Dictionaryには約60万語が収録されており、これは他の言語を大きく上回る。"
  },
  {
    id: 17,
    type: 'quote',
    category: 'general',
    content: "Language is the road map of a culture. It tells you where its people come from and where they are going.",
    translation: "言語は文化の地図である。その人々がどこから来て、どこへ向かうかを教えてくれる。",
    explanation: "言語学者リタ・メイ・ブラウンの言葉。言語と文化の深い関係を示している。"
  },
  {
    id: 18,
    type: 'tip',
    category: 'general',
    content: "The word 'queue' is pronounced the same even if you remove 4 letters!",
    translation: "「queue」という単語は4文字削除しても発音が同じ！",
    explanation: "'queue' → 'que' → 'qu' → 'q' と文字を削除しても、すべて 'kyu' と発音される。"
  },
  {
    id: 19,
    type: 'quote',
    category: 'general',
    content: "One language sets you in a corridor for life. Two languages open every door along the way.",
    translation: "一つの言語は人生の廊下にあなたを置く。二つの言語は道中のすべての扉を開く。",
    explanation: "フランク・スミスの言葉。多言語習得の価値を表現している。"
  },
  {
    id: 20,
    type: 'tip',
    category: 'general',
    content: "The shortest complete sentence in English is 'I am.'",
    translation: "英語で最も短い完全な文は「I am.」である。",
    explanation: "主語と動詞を含む完全な文として、最も短い形の例。"
  },

  // 映画・ドラマの有名なセリフ
  {
    id: 21,
    type: 'quote',
    category: 'general',
    content: "May the Force be with you.",
    translation: "フォースが共にあらんことを。",
    explanation: "スター・ウォーズシリーズの有名なセリフ。日常でも「頑張って」の意味で使われる。"
  },
  {
    id: 22,
    type: 'quote',
    category: 'general',
    content: "I'll be back.",
    translation: "また戻ってくる。",
    explanation: "ターミネーターシリーズのアーノルド・シュワルツェネッガーの名セリフ。最も有名な映画のセリフの一つ。"
  },
  {
    id: 23,
    type: 'quote',
    category: 'general',
    content: "Life is like a box of chocolates. You never know what you're gonna get.",
    translation: "人生はチョコレートの箱のようなもの。何が入っているかわからない。",
    explanation: "映画「フォレスト・ガンプ」の名セリフ。人生の不確実性を表現した美しい比喩。"
  },
  {
    id: 24,
    type: 'quote',
    category: 'general',
    content: "To infinity and beyond!",
    translation: "無限の彼方へ！",
    explanation: "トイ・ストーリーのバズ・ライトイヤーの決めゼリフ。目標に向かって突き進む気持ちを表現。"
  },
  {
    id: 25,
    type: 'quote',
    category: 'general',
    content: "I'm the king of the world!",
    translation: "俺は世界の王だ！",
    explanation: "映画「タイタニック」のジャックのセリフ。自由と希望を表現した名シーン。"
  },
  {
    id: 26,
    type: 'quote',
    category: 'general',
    content: "You can't handle the truth!",
    translation: "お前には真実は扱えない！",
    explanation: "映画「ア・フュー・グッドメン」の名セリフ。真実の重さを表現した力強い言葉。"
  },
  {
    id: 27,
    type: 'quote',
    category: 'general',
    content: "Houston, we have a problem.",
    translation: "ヒューストン、問題が発生しました。",
    explanation: "映画「アポロ13」のセリフ。危機的状況を冷静に報告する際の表現として使われる。"
  },
  {
    id: 28,
    type: 'quote',
    category: 'general',
    content: "Elementary, my dear Watson.",
    translation: "初歩的なことだ、ワトソン君。",
    explanation: "シャーロック・ホームズの名セリフ。推理小説やドラマでよく使われる表現。"
  },
  {
    id: 29,
    type: 'quote',
    category: 'general',
    content: "I'll make him an offer he can't refuse.",
    translation: "断れない条件を提示してやる。",
    explanation: "映画「ゴッドファーザー」の名セリフ。ビジネスでも使われる強気な表現。"
  },
  {
    id: 30,
    type: 'quote',
    category: 'general',
    content: "Keep your friends close, but your enemies closer.",
    translation: "友人は近くに、敵はもっと近くに置け。",
    explanation: "映画「ゴッドファーザー」の名セリフ。戦略的思考を表現した格言として使われる。"
  },
  {
    id: 31,
    type: 'quote',
    category: 'general',
    content: "I'm walking here!",
    translation: "歩いてるんだよ！",
    explanation: "映画「ミッドナイト・カウボーイ」の名セリフ。ニューヨークの街角でよく使われる表現。"
  },
  {
    id: 32,
    type: 'quote',
    category: 'general',
    content: "Here's looking at you, kid.",
    translation: "君を見つめているよ、坊や。",
    explanation: "映画「カサブランカ」の名セリフ。別れの際の美しい表現として知られる。"
  },
  {
    id: 33,
    type: 'quote',
    category: 'general',
    content: "I'll be there for you.",
    translation: "君のためにそこにいるよ。",
    explanation: "ドラマ「フレンズ」のテーマソングの歌詞。友情を表現した温かい言葉。"
  },
  {
    id: 34,
    type: 'quote',
    category: 'general',
    content: "Winter is coming.",
    translation: "冬が来る。",
    explanation: "ドラマ「ゲーム・オブ・スローンズ」の名セリフ。警告や予兆を表現する際に使われる。"
  },
  {
    id: 35,
    type: 'quote',
    category: 'general',
    content: "You know nothing, Jon Snow.",
    translation: "君は何も知らない、ジョン・スノー。",
    explanation: "ドラマ「ゲーム・オブ・スローンズ」のイグリットのセリフ。無知を指摘する際に使われる。"
  },
  {
    id: 36,
    type: 'quote',
    category: 'general',
    content: "I am Iron Man.",
    translation: "俺はアイアンマンだ。",
    explanation: "映画「アイアンマン」シリーズのトニー・スタークのセリフ。自信を表現する際に使われる。"
  },
  {
    id: 37,
    type: 'quote',
    category: 'general',
    content: "With great power comes great responsibility.",
    translation: "大きな力には大きな責任が伴う。",
    explanation: "スパイダーマンシリーズの名セリフ。責任感の重要性を表現した格言。"
  },
  {
    id: 38,
    type: 'quote',
    category: 'general',
    content: "I'm Batman.",
    translation: "俺はバットマンだ。",
    explanation: "バットマンシリーズの名セリフ。シンプルで力強い自己紹介の表現。"
  },
  {
    id: 39,
    type: 'quote',
    category: 'general',
    content: "I'm not a smart man, but I know what love is.",
    translation: "俺は賢い男じゃないが、愛が何かは知っている。",
    explanation: "映画「フォレスト・ガンプ」の名セリフ。シンプルで心に響く愛の表現。"
  },
  {
    id: 40,
    type: 'quote',
    category: 'general',
    content: "I'm the captain now.",
    translation: "俺が船長だ。",
    explanation: "映画「キャプテン・フィリップス」の名セリフ。主導権を握った際の表現として使われる。"
  },
  {
    id: 41,
    type: 'quote',
    category: 'general',
    content: "I see dead people.",
    translation: "死んだ人が見える。",
    explanation: "映画「シックス・センス」の名セリフ。超自然現象を表現する際に使われる。"
  },
  {
    id: 42,
    type: 'quote',
    category: 'general',
    content: "There's no place like home.",
    translation: "家ほど良い場所はない。",
    explanation: "映画「オズの魔法使い」のドロシーのセリフ。故郷の大切さを表現した名セリフ。"
  },
  {
    id: 43,
    type: 'quote',
    category: 'general',
    content: "I'm going to make him an offer he can't refuse.",
    translation: "断れない条件を提示してやる。",
    explanation: "映画「ゴッドファーザー」の名セリフ。ビジネスでも使われる強気な表現。"
  },
  {
    id: 44,
    type: 'quote',
    category: 'general',
    content: "I'll have what she's having.",
    translation: "彼女と同じものをください。",
    explanation: "映画「ハリーとサリー」の名セリフ。レストランでよく使われる表現。"
  },
  {
    id: 45,
    type: 'quote',
    category: 'general',
    content: "I'm the king of the world!",
    translation: "俺は世界の王だ！",
    explanation: "映画「タイタニック」のジャックのセリフ。自由と希望を表現した名シーン。"
  },
  {
    id: 46,
    type: 'quote',
    category: 'general',
    content: "I'm walking here!",
    translation: "歩いてるんだよ！",
    explanation: "映画「ミッドナイト・カウボーイ」の名セリフ。ニューヨークの街角でよく使われる表現。"
  },
  {
    id: 47,
    type: 'quote',
    category: 'general',
    content: "I'll be back.",
    translation: "また戻ってくる。",
    explanation: "ターミネーターシリーズのアーノルド・シュワルツェネッガーの名セリフ。最も有名な映画のセリフの一つ。"
  },
  {
    id: 48,
    type: 'quote',
    category: 'general',
    content: "I'm the king of the world!",
    translation: "俺は世界の王だ！",
    explanation: "映画「タイタニック」のジャックのセリフ。自由と希望を表現した名シーン。"
  },
  {
    id: 49,
    type: 'quote',
    category: 'general',
    content: "I'm walking here!",
    translation: "歩いてるんだよ！",
    explanation: "映画「ミッドナイト・カウボーイ」の名セリフ。ニューヨークの街角でよく使われる表現。"
  },
  {
    id: 50,
    type: 'quote',
    category: 'general',
    content: "I'll be back.",
    translation: "また戻ってくる。",
    explanation: "ターミネーターシリーズのアーノルド・シュワルツェネッガーの名セリフ。最も有名な映画のセリフの一つ。"
  }
];

// ランダムにチップを取得する関数
export function getRandomEnglishTip(category?: 'grammar' | 'vocabulary' | 'general'): EnglishTip {
  let filteredTips = englishTips;
  
  if (category) {
    filteredTips = englishTips.filter(tip => tip.category === category);
  }
  
  const randomIndex = Math.floor(Math.random() * filteredTips.length);
  return filteredTips[randomIndex];
}

// 複数のチップを取得する関数
export function getRandomEnglishTips(count: number, category?: 'grammar' | 'vocabulary' | 'general'): EnglishTip[] {
  let filteredTips = englishTips;
  
  if (category) {
    filteredTips = englishTips.filter(tip => tip.category === category);
  }
  
  const shuffled = [...filteredTips].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
