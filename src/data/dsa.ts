import adobeLogo from "@/assets/adobe.png";
import airbnbLogo from "@/assets/airbnb.png";
import amazonLogo from "@/assets/Amazon.png";
import appleLogo from "@/assets/apple.png";
import atlassianLogo from "@/assets/atlassian.png";
import bloombergLogo from "@/assets/bloomberg.png";
import citadelLogo from "@/assets/Citadel.png";
import flipkartLogo from "@/assets/flipkart.png";
import goldmanLogo from "@/assets/goldman.png";
import googleLogo from "@/assets/google.png";
import metaLogo from "@/assets/meta.png";
import microsoftLogo from "@/assets/microsoft.png";
import netflixLogo from "@/assets/netflix.png";
import nvidiaLogo from "@/assets/nvidia.png";
import oracleLogo from "@/assets/Oracle.png";
import pinterestLogo from "@/assets/pinterest.png";
import salesforceLogo from "@/assets/Salesforce.png";
import snowflakeLogo from "@/assets/Snowflake.png";
import tcsLogo from "@/assets/TCS.png";
import tiktokLogo from "@/assets/tiktok.png";
import uberLogo from "@/assets/uber.png";
import visaLogo from "@/assets/visa.png";
import walmartLogo from "@/assets/Walmart.png";

import type { DsaCompany, DsaQuestion } from "@/types/prepdoc";

type RawQuestion = {
  id: number;
  t: string;
  d: DsaQuestion["difficulty"];
  freq: number;
  tags: string[];
};

function toQuestionUrl(title: string) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `https://leetcode.com/problems/${slug}/`;
}

function toCompanyId(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

function normalizeDifficulty(value: string): DsaQuestion["difficulty"] {
  const normalized = value.trim().toLowerCase().replace(/\./g, "");
  if (normalized.startsWith("easy")) return "Easy";
  if (normalized.startsWith("med")) return "Medium";
  return "Hard";
}

function parseQuestionFeed(feed: string): RawQuestion[] {
  return feed
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      const [header = "", frequencyLine = "", difficultyLine = ""] = lines;
      const match = header.match(/^(\d+)\.\s*(.+)$/);

      if (!match) {
        throw new Error(`Invalid Google question feed row: ${header}`);
      }

      const frequency = Number.parseFloat(frequencyLine.replace("%", ""));

      return {
        id: Number(match[1]),
        t: match[2],
        d: normalizeDifficulty(difficultyLine),
        freq: Number.isFinite(frequency) ? Math.round(frequency) : 0,
        tags: [],
      };
    });
}

function mergeQuestionFeeds(seed: RawQuestion[], recent: RawQuestion[]) {
  const merged = new Map<number, RawQuestion>();

  for (const question of seed) {
    merged.set(question.id, question);
  }

  for (const question of recent) {
    const existing = merged.get(question.id);
    merged.set(
      question.id,
      existing ? { ...question, tags: existing.tags } : question,
    );
  }

  return Array.from(merged.values()).sort(
    (a, b) => b.freq - a.freq || a.id - b.id,
  );
}

function buildQuestions(
  companyName: string,
  questions: RawQuestion[],
): DsaQuestion[] {
  const companyId = toCompanyId(companyName);

  return questions.map((question) => ({
    id: `${companyId}-${question.id}`,
    number: question.id,
    title: question.t,
    difficulty: question.d,
    frequency: question.freq,
    tags: question.tags,
    url: toQuestionUrl(question.t),
  }));
}

const companyMeta: Record<string, { accent: string; logo: string }> = {
  Google: { accent: "#4285F4", logo: googleLogo },
  Meta: { accent: "#0866FF", logo: metaLogo },
  Amazon: { accent: "#FF9900", logo: amazonLogo },
  Apple: { accent: "#555555", logo: appleLogo },
  Netflix: { accent: "#E50914", logo: netflixLogo },
  Microsoft: { accent: "#0078D4", logo: microsoftLogo },
  Adobe: { accent: "#FF0000", logo: adobeLogo },
  Uber: { accent: "#111111", logo: uberLogo },
  Flipkart: { accent: "#2874F0", logo: flipkartLogo },
  Walmart: { accent: "#0071CE", logo: walmartLogo },
  Atlassian: { accent: "#0052CC", logo: atlassianLogo },
  Bloomberg: { accent: "#000000", logo: bloombergLogo },
  TikTok: { accent: "#010101", logo: tiktokLogo },
  Nvidia: { accent: "#76B900", logo: nvidiaLogo },
  Salesforce: { accent: "#00A1E0", logo: salesforceLogo },
  "Goldman Sachs": { accent: "#0065A4", logo: goldmanLogo },
  Citadel: { accent: "#121212", logo: citadelLogo },
  Snowflake: { accent: "#29B5E8", logo: snowflakeLogo },
  TCS: { accent: "#EE1C25", logo: tcsLogo },
  Airbnb: { accent: "#FF5A5F", logo: airbnbLogo },
  Pinterest: { accent: "#E60023", logo: pinterestLogo },
  Oracle: { accent: "#C74634", logo: oracleLogo },
  Visa: { accent: "#1A1F71", logo: visaLogo },
};

const rawQuestionsByCompany: Record<string, RawQuestion[]> = {
  Google: [
    { id: 1, t: "Two Sum", d: "Easy", freq: 95, tags: ["Array", "Hash Table"] },
    {
      id: 2,
      t: "Add Two Numbers",
      d: "Medium",
      freq: 75,
      tags: ["Linked List", "Math"],
    },
    {
      id: 3,
      t: "Longest Substring Without Repeating Characters",
      d: "Medium",
      freq: 88,
      tags: ["Hash Table", "Sliding Window"],
    },
    {
      id: 4,
      t: "Median of Two Sorted Arrays",
      d: "Hard",
      freq: 72,
      tags: ["Array", "Binary Search"],
    },
    {
      id: 5,
      t: "Longest Palindromic Substring",
      d: "Medium",
      freq: 65,
      tags: ["String", "DP"],
    },
    {
      id: 10,
      t: "Regular Expression Matching",
      d: "Hard",
      freq: 62,
      tags: ["String", "DP", "Recursion"],
    },
    {
      id: 20,
      t: "Valid Parentheses",
      d: "Easy",
      freq: 80,
      tags: ["String", "Stack"],
    },
    {
      id: 21,
      t: "Merge Two Sorted Lists",
      d: "Easy",
      freq: 70,
      tags: ["Linked List"],
    },
    {
      id: 23,
      t: "Merge k Sorted Lists",
      d: "Hard",
      freq: 70,
      tags: ["Linked List", "Heap"],
    },
    {
      id: 37,
      t: "Sudoku Solver",
      d: "Hard",
      freq: 60,
      tags: ["Array", "Backtracking", "Matrix"],
    },
    {
      id: 41,
      t: "First Missing Positive",
      d: "Hard",
      freq: 65,
      tags: ["Array", "Hash Table"],
    },
    {
      id: 42,
      t: "Trapping Rain Water",
      d: "Hard",
      freq: 85,
      tags: ["Array", "Two Pointers", "Stack"],
    },
    {
      id: 44,
      t: "Wildcard Matching",
      d: "Hard",
      freq: 60,
      tags: ["String", "DP", "Greedy"],
    },
    {
      id: 45,
      t: "Jump Game II",
      d: "Medium",
      freq: 68,
      tags: ["Array", "DP", "Greedy"],
    },
    {
      id: 51,
      t: "N-Queens",
      d: "Hard",
      freq: 62,
      tags: ["Array", "Backtracking"],
    },
    {
      id: 56,
      t: "Merge Intervals",
      d: "Medium",
      freq: 90,
      tags: ["Array", "Sorting"],
    },
    { id: 57, t: "Insert Interval", d: "Medium", freq: 78, tags: ["Array"] },
    {
      id: 68,
      t: "Text Justification",
      d: "Hard",
      freq: 65,
      tags: ["Array", "String", "Simulation"],
    },
    {
      id: 72,
      t: "Edit Distance",
      d: "Medium",
      freq: 70,
      tags: ["String", "DP"],
    },
    {
      id: 76,
      t: "Minimum Window Substring",
      d: "Hard",
      freq: 82,
      tags: ["String", "Sliding Window"],
    },
    {
      id: 84,
      t: "Largest Rectangle in Histogram",
      d: "Hard",
      freq: 68,
      tags: ["Array", "Stack", "Monotonic Stack"],
    },
    {
      id: 85,
      t: "Maximal Rectangle",
      d: "Hard",
      freq: 62,
      tags: ["Array", "Stack", "DP", "Matrix"],
    },
    {
      id: 97,
      t: "Interleaving String",
      d: "Medium",
      freq: 60,
      tags: ["String", "DP"],
    },
    {
      id: 115,
      t: "Distinct Subsequences",
      d: "Hard",
      freq: 58,
      tags: ["String", "DP"],
    },
    {
      id: 121,
      t: "Best Time to Buy and Sell Stock",
      d: "Easy",
      freq: 88,
      tags: ["Array", "DP"],
    },
    {
      id: 127,
      t: "Word Ladder",
      d: "Hard",
      freq: 72,
      tags: ["BFS", "Hash Table"],
    },
    {
      id: 128,
      t: "Longest Consecutive Sequence",
      d: "Medium",
      freq: 80,
      tags: ["Array", "Hash Table"],
    },
    {
      id: 140,
      t: "Word Break II",
      d: "Hard",
      freq: 65,
      tags: ["Hash Table", "String", "DP", "Backtracking"],
    },
    {
      id: 146,
      t: "LRU Cache",
      d: "Medium",
      freq: 92,
      tags: ["Hash Table", "Linked List", "Design"],
    },
    {
      id: 155,
      t: "Min Stack",
      d: "Medium",
      freq: 70,
      tags: ["Stack", "Design"],
    },
    {
      id: 157,
      t: "Read N Characters Given Read4",
      d: "Easy",
      freq: 65,
      tags: ["Array", "Simulation", "Interactive"],
    },
    {
      id: 158,
      t: "Read N Characters Given Read4 II",
      d: "Hard",
      freq: 60,
      tags: ["Array", "Simulation", "Interactive"],
    },
    {
      id: 161,
      t: "One Edit Distance",
      d: "Medium",
      freq: 68,
      tags: ["Two Pointers", "String"],
    },
    { id: 163, t: "Missing Ranges", d: "Easy", freq: 62, tags: ["Array"] },
    {
      id: 168,
      t: "Excel Sheet Column Title",
      d: "Easy",
      freq: 60,
      tags: ["Math", "String"],
    },
    {
      id: 173,
      t: "Binary Search Tree Iterator",
      d: "Medium",
      freq: 65,
      tags: ["Stack", "Tree", "Design", "Iterator", "BST"],
    },
    {
      id: 200,
      t: "Number of Islands",
      d: "Medium",
      freq: 85,
      tags: ["Array", "DFS", "BFS", "Union Find"],
    },
    {
      id: 207,
      t: "Course Schedule",
      d: "Medium",
      freq: 75,
      tags: ["DFS", "BFS", "Graph", "Topological Sort"],
    },
    {
      id: 208,
      t: "Implement Trie",
      d: "Medium",
      freq: 78,
      tags: ["Hash Table", "String", "Design", "Trie"],
    },
    {
      id: 212,
      t: "Word Search II",
      d: "Hard",
      freq: 65,
      tags: ["Array", "String", "Backtracking", "Trie"],
    },
    {
      id: 218,
      t: "The Skyline Problem",
      d: "Hard",
      freq: 60,
      tags: ["Array", "Divide and Conquer", "Segment Tree"],
    },
    {
      id: 224,
      t: "Basic Calculator",
      d: "Hard",
      freq: 65,
      tags: ["Math", "String", "Stack", "Recursion"],
    },
    {
      id: 227,
      t: "Basic Calculator II",
      d: "Medium",
      freq: 68,
      tags: ["Math", "String", "Stack"],
    },
    {
      id: 238,
      t: "Product of Array Except Self",
      d: "Medium",
      freq: 88,
      tags: ["Array", "Prefix Sum"],
    },
    {
      id: 253,
      t: "Meeting Rooms II",
      d: "Medium",
      freq: 90,
      tags: ["Array", "Sorting", "Heap"],
    },
    {
      id: 269,
      t: "Alien Dictionary",
      d: "Hard",
      freq: 70,
      tags: [
        "Array",
        "String",
        "DFS",
        "BFS",
        "Graph",
        "Topological Sort",
        "Trie",
      ],
    },
    {
      id: 273,
      t: "Integer to English Words",
      d: "Hard",
      freq: 65,
      tags: ["Math", "String", "Recursion"],
    },
    {
      id: 295,
      t: "Find Median from Data Stream",
      d: "Hard",
      freq: 75,
      tags: ["Sorting", "Heap", "Design"],
    },
    {
      id: 297,
      t: "Serialize and Deserialize Binary Tree",
      d: "Hard",
      freq: 72,
      tags: ["String", "Tree", "DFS", "BFS", "Design"],
    },
    {
      id: 301,
      t: "Remove Invalid Parentheses",
      d: "Hard",
      freq: 62,
      tags: ["String", "BFS", "Backtracking"],
    },
    {
      id: 315,
      t: "Count of Smaller Numbers After Self",
      d: "Hard",
      freq: 60,
      tags: ["Array", "Binary Indexed Tree", "Merge Sort"],
    },
    {
      id: 332,
      t: "Reconstruct Itinerary",
      d: "Hard",
      freq: 58,
      tags: ["DFS", "Graph", "Euler Circuit"],
    },
    {
      id: 340,
      t: "Longest Substring with At Most K Distinct Characters",
      d: "Medium",
      freq: 80,
      tags: ["Hash Table", "Sliding Window"],
    },
    {
      id: 354,
      t: "Russian Doll Envelopes",
      d: "Hard",
      freq: 60,
      tags: ["Array", "Binary Search", "DP", "Sorting"],
    },
    {
      id: 358,
      t: "Rearrange String k Distance Apart",
      d: "Hard",
      freq: 60,
      tags: ["Hash Table", "String", "Greedy", "Heap"],
    },
    {
      id: 362,
      t: "Design Hit Counter",
      d: "Medium",
      freq: 72,
      tags: ["Queue", "Design"],
    },
    {
      id: 380,
      t: "Insert Delete GetRandom O(1)",
      d: "Medium",
      freq: 76,
      tags: ["Array", "Hash Table", "Math", "Design"],
    },
    {
      id: 398,
      t: "Random Pick Index",
      d: "Medium",
      freq: 65,
      tags: ["Hash Table", "Math", "Reservoir Sampling"],
    },
    {
      id: 410,
      t: "Split Array Largest Sum",
      d: "Hard",
      freq: 68,
      tags: ["Array", "Binary Search", "DP"],
    },
    {
      id: 460,
      t: "LFU Cache",
      d: "Hard",
      freq: 65,
      tags: ["Hash Table", "Linked List", "Design"],
    },
    {
      id: 465,
      t: "Optimal Account Balancing",
      d: "Hard",
      freq: 60,
      tags: ["Array", "DP", "Backtracking", "Bit Manipulation"],
    },
    {
      id: 480,
      t: "Sliding Window Median",
      d: "Hard",
      freq: 60,
      tags: ["Array", "Hash Table", "Sliding Window", "Heap", "Sorting"],
    },
    {
      id: 489,
      t: "Robot Room Cleaner",
      d: "Hard",
      freq: 62,
      tags: ["Backtracking", "Interactive"],
    },
    {
      id: 505,
      t: "The Maze II",
      d: "Medium",
      freq: 65,
      tags: ["Array", "DFS", "BFS", "Graph", "Heap", "Matrix"],
    },
    {
      id: 535,
      t: "Encode and Decode TinyURL",
      d: "Medium",
      freq: 78,
      tags: ["Hash Table", "Math", "String", "Design"],
    },
    {
      id: 588,
      t: "Design In-Memory File System",
      d: "Hard",
      freq: 60,
      tags: ["Hash Table", "String", "Design", "Trie"],
    },
    {
      id: 604,
      t: "Design Compressed String Iterator",
      d: "Easy",
      freq: 58,
      tags: ["Array", "Hash Table", "Design", "Iterator"],
    },
    {
      id: 616,
      t: "Add Bold Tag in String",
      d: "Medium",
      freq: 60,
      tags: ["Array", "Hash Table", "String", "Trie"],
    },
    {
      id: 632,
      t: "Smallest Range Covering Elements from K Lists",
      d: "Hard",
      freq: 60,
      tags: [
        "Array",
        "Hash Table",
        "Greedy",
        "Sliding Window",
        "Sorting",
        "Heap",
      ],
    },
    {
      id: 642,
      t: "Design Search Autocomplete System",
      d: "Hard",
      freq: 70,
      tags: ["String", "Design", "Trie"],
    },
    {
      id: 675,
      t: "Cut Off Trees for Golf Event",
      d: "Hard",
      freq: 58,
      tags: ["Array", "BFS", "Matrix", "Heap"],
    },
    {
      id: 711,
      t: "Number of Distinct Islands II",
      d: "Hard",
      freq: 55,
      tags: ["Hash Table", "DFS", "BFS", "Union Find"],
    },
    {
      id: 716,
      t: "Max Stack",
      d: "Hard",
      freq: 60,
      tags: ["Stack", "Design", "Doubly-Linked List", "Ordered Set"],
    },
    {
      id: 722,
      t: "Remove Comments",
      d: "Medium",
      freq: 60,
      tags: ["Array", "String"],
    },
    {
      id: 737,
      t: "Sentence Similarity II",
      d: "Medium",
      freq: 62,
      tags: ["Array", "Hash Table", "DFS", "BFS", "Union Find", "String"],
    },
    {
      id: 759,
      t: "Employee Free Time",
      d: "Hard",
      freq: 65,
      tags: ["Array", "Sorting", "Heap"],
    },
    {
      id: 843,
      t: "Guess the Word",
      d: "Hard",
      freq: 58,
      tags: ["Array", "Math", "Game Theory"],
    },
    {
      id: 855,
      t: "Exam Room",
      d: "Medium",
      freq: 62,
      tags: ["Ordered Set", "Design"],
    },
    {
      id: 857,
      t: "Minimum Cost to Hire K Workers",
      d: "Hard",
      freq: 58,
      tags: ["Array", "Greedy", "Sorting", "Heap"],
    },
    {
      id: 886,
      t: "Possible Bipartition",
      d: "Medium",
      freq: 62,
      tags: ["DFS", "BFS", "Graph", "Union Find"],
    },
    {
      id: 939,
      t: "Minimum Area Rectangle",
      d: "Medium",
      freq: 65,
      tags: ["Array", "Hash Table", "Math", "Geometry"],
    },
    {
      id: 980,
      t: "Unique Paths III",
      d: "Hard",
      freq: 60,
      tags: ["Array", "Backtracking", "Bit Manipulation", "Matrix"],
    },
    {
      id: 1004,
      t: "Max Consecutive Ones III",
      d: "Medium",
      freq: 65,
      tags: ["Array", "Binary Search", "Sliding Window", "Prefix Sum"],
    },
    {
      id: 1057,
      t: "Campus Bikes",
      d: "Medium",
      freq: 62,
      tags: ["Array", "Greedy", "Sorting", "Heap"],
    },
    {
      id: 1087,
      t: "Brace Expansion",
      d: "Medium",
      freq: 60,
      tags: ["String", "Backtracking", "BFS"],
    },
    {
      id: 1110,
      t: "Delete Nodes And Return Forest",
      d: "Medium",
      freq: 62,
      tags: ["Array", "Hash Table", "Tree", "DFS"],
    },
    {
      id: 1153,
      t: "String Transforms Into Another String",
      d: "Hard",
      freq: 58,
      tags: ["Hash Table", "String", "Union Find"],
    },
    {
      id: 1192,
      t: "Critical Connections in a Network",
      d: "Hard",
      freq: 60,
      tags: ["DFS", "Graph", "Biconnected Component"],
    },
    {
      id: 1197,
      t: "Minimum Knight Moves",
      d: "Medium",
      freq: 62,
      tags: ["BFS"],
    },
    {
      id: 1293,
      t: "Shortest Path in a Grid with Obstacles Elimination",
      d: "Hard",
      freq: 60,
      tags: ["Array", "BFS", "Matrix"],
    },
    {
      id: 1326,
      t: "Minimum Number of Taps to Open to Water a Garden",
      d: "Hard",
      freq: 58,
      tags: ["Array", "DP", "Greedy"],
    },
    {
      id: 1428,
      t: "Leftmost Column with at Least a One",
      d: "Medium",
      freq: 65,
      tags: ["Array", "Binary Search", "Interactive", "Matrix"],
    },
    {
      id: 1570,
      t: "Dot Product of Two Sparse Vectors",
      d: "Medium",
      freq: 68,
      tags: ["Array", "Hash Table", "Two Pointers", "Design"],
    },
  ],
  Meta: [
    { id: 1, t: "Two Sum", d: "Easy", freq: 97, tags: ["Array", "Hash Table"] },
    {
      id: 2,
      t: "Add Two Numbers",
      d: "Medium",
      freq: 88,
      tags: ["Linked List", "Math"],
    },
    {
      id: 15,
      t: "3Sum",
      d: "Medium",
      freq: 92,
      tags: ["Array", "Two Pointers", "Sorting"],
    },
    {
      id: 17,
      t: "Letter Combinations of a Phone Number",
      d: "Medium",
      freq: 80,
      tags: ["Hash Table", "String", "Backtracking"],
    },
    {
      id: 20,
      t: "Valid Parentheses",
      d: "Easy",
      freq: 85,
      tags: ["String", "Stack"],
    },
    {
      id: 21,
      t: "Merge Two Sorted Lists",
      d: "Easy",
      freq: 85,
      tags: ["Linked List"],
    },
    {
      id: 23,
      t: "Merge k Sorted Lists",
      d: "Hard",
      freq: 78,
      tags: ["Linked List", "Divide and Conquer", "Heap"],
    },
    {
      id: 25,
      t: "Reverse Nodes in k-Group",
      d: "Hard",
      freq: 70,
      tags: ["Linked List", "Recursion"],
    },
    {
      id: 31,
      t: "Next Permutation",
      d: "Medium",
      freq: 72,
      tags: ["Array", "Two Pointers"],
    },
    {
      id: 33,
      t: "Search in Rotated Sorted Array",
      d: "Medium",
      freq: 85,
      tags: ["Array", "Binary Search"],
    },
    {
      id: 50,
      t: "Pow(x, n)",
      d: "Medium",
      freq: 75,
      tags: ["Math", "Recursion", "Binary Search"],
    },
    {
      id: 56,
      t: "Merge Intervals",
      d: "Medium",
      freq: 88,
      tags: ["Array", "Sorting"],
    },
    { id: 66, t: "Plus One", d: "Easy", freq: 70, tags: ["Array", "Math"] },
    {
      id: 69,
      t: "Sqrt(x)",
      d: "Easy",
      freq: 68,
      tags: ["Math", "Binary Search"],
    },
    {
      id: 75,
      t: "Sort Colors",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Two Pointers", "Sorting"],
    },
    {
      id: 88,
      t: "Merge Sorted Array",
      d: "Easy",
      freq: 82,
      tags: ["Array", "Two Pointers", "Sorting"],
    },
    {
      id: 98,
      t: "Validate Binary Search Tree",
      d: "Medium",
      freq: 82,
      tags: ["Tree", "DFS", "BST"],
    },
    {
      id: 112,
      t: "Path Sum",
      d: "Easy",
      freq: 72,
      tags: ["Tree", "DFS", "BFS"],
    },
    {
      id: 116,
      t: "Populating Next Right Pointers in Each Node",
      d: "Medium",
      freq: 70,
      tags: ["Linked List", "Tree", "DFS", "BFS"],
    },
    {
      id: 121,
      t: "Best Time to Buy and Sell Stock",
      d: "Easy",
      freq: 90,
      tags: ["Array", "DP"],
    },
    {
      id: 124,
      t: "Binary Tree Maximum Path Sum",
      d: "Hard",
      freq: 80,
      tags: ["Tree", "DFS", "DP"],
    },
    {
      id: 125,
      t: "Valid Palindrome",
      d: "Easy",
      freq: 88,
      tags: ["Two Pointers", "String"],
    },
    {
      id: 129,
      t: "Sum Root to Leaf Numbers",
      d: "Medium",
      freq: 72,
      tags: ["Tree", "DFS", "Math"],
    },
    {
      id: 133,
      t: "Clone Graph",
      d: "Medium",
      freq: 80,
      tags: ["Hash Table", "DFS", "BFS", "Graph"],
    },
    {
      id: 138,
      t: "Copy List with Random Pointer",
      d: "Medium",
      freq: 80,
      tags: ["Hash Table", "Linked List"],
    },
    {
      id: 140,
      t: "Word Break II",
      d: "Hard",
      freq: 70,
      tags: ["Hash Table", "String", "DP", "Backtracking", "Trie"],
    },
    {
      id: 146,
      t: "LRU Cache",
      d: "Medium",
      freq: 90,
      tags: ["Hash Table", "Linked List", "Design"],
    },
    {
      id: 162,
      t: "Find Peak Element",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Binary Search"],
    },
    {
      id: 173,
      t: "Binary Search Tree Iterator",
      d: "Medium",
      freq: 72,
      tags: ["Stack", "Tree", "Design", "BST"],
    },
    {
      id: 200,
      t: "Number of Islands",
      d: "Medium",
      freq: 82,
      tags: ["Array", "DFS", "BFS", "Union Find"],
    },
    {
      id: 206,
      t: "Reverse Linked List",
      d: "Easy",
      freq: 92,
      tags: ["Linked List", "Recursion"],
    },
    {
      id: 215,
      t: "Kth Largest Element in an Array",
      d: "Medium",
      freq: 82,
      tags: ["Array", "Divide and Conquer", "Sorting", "Heap", "Quickselect"],
    },
    {
      id: 227,
      t: "Basic Calculator II",
      d: "Medium",
      freq: 72,
      tags: ["Math", "String", "Stack"],
    },
    {
      id: 236,
      t: "Lowest Common Ancestor of a Binary Tree",
      d: "Medium",
      freq: 85,
      tags: ["Tree", "DFS"],
    },
    {
      id: 238,
      t: "Product of Array Except Self",
      d: "Medium",
      freq: 85,
      tags: ["Array", "Prefix Sum"],
    },
    {
      id: 240,
      t: "Search a 2D Matrix II",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Binary Search", "Divide and Conquer", "Matrix"],
    },
    {
      id: 249,
      t: "Group Shifted Strings",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Hash Table", "String"],
    },
    {
      id: 253,
      t: "Meeting Rooms II",
      d: "Medium",
      freq: 85,
      tags: ["Array", "Sorting", "Heap"],
    },
    {
      id: 261,
      t: "Graph Valid Tree",
      d: "Medium",
      freq: 75,
      tags: ["DFS", "BFS", "Graph", "Union Find"],
    },
    {
      id: 273,
      t: "Integer to English Words",
      d: "Hard",
      freq: 72,
      tags: ["Math", "String", "Recursion"],
    },
    {
      id: 282,
      t: "Expression Add Operators",
      d: "Hard",
      freq: 68,
      tags: ["Math", "String", "Backtracking"],
    },
    {
      id: 283,
      t: "Move Zeroes",
      d: "Easy",
      freq: 85,
      tags: ["Array", "Two Pointers"],
    },
    {
      id: 301,
      t: "Remove Invalid Parentheses",
      d: "Hard",
      freq: 65,
      tags: ["String", "BFS", "Backtracking"],
    },
    {
      id: 311,
      t: "Sparse Matrix Multiplication",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Hash Table", "Matrix"],
    },
    {
      id: 314,
      t: "Binary Tree Vertical Order Traversal",
      d: "Medium",
      freq: 82,
      tags: ["Hash Table", "Tree", "DFS", "BFS", "Sorting"],
    },
    {
      id: 322,
      t: "Coin Change",
      d: "Medium",
      freq: 80,
      tags: ["Array", "DP", "BFS"],
    },
    {
      id: 339,
      t: "Nested List Weight Sum",
      d: "Medium",
      freq: 72,
      tags: ["DFS", "BFS"],
    },
    {
      id: 348,
      t: "Design Tic-Tac-Toe",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Hash Table", "Design", "Matrix"],
    },
    {
      id: 362,
      t: "Design Hit Counter",
      d: "Medium",
      freq: 78,
      tags: ["Queue", "Design"],
    },
    {
      id: 408,
      t: "Valid Word Abbreviation",
      d: "Easy",
      freq: 80,
      tags: ["Two Pointers", "String"],
    },
    {
      id: 426,
      t: "Convert BST to Sorted Doubly Linked List",
      d: "Medium",
      freq: 75,
      tags: ["Linked List", "Tree", "BST", "DFS"],
    },
    {
      id: 528,
      t: "Random Pick with Weight",
      d: "Medium",
      freq: 78,
      tags: ["Math", "Binary Search", "Prefix Sum", "Randomized"],
    },
    {
      id: 543,
      t: "Diameter of Binary Tree",
      d: "Easy",
      freq: 82,
      tags: ["Tree", "DFS"],
    },
    {
      id: 560,
      t: "Subarray Sum Equals K",
      d: "Medium",
      freq: 85,
      tags: ["Array", "Hash Table", "Prefix Sum"],
    },
    {
      id: 572,
      t: "Subtree of Another Tree",
      d: "Easy",
      freq: 78,
      tags: ["Tree", "DFS", "Hash Function"],
    },
    {
      id: 621,
      t: "Task Scheduler",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Hash Table", "Greedy", "Heap"],
    },
    {
      id: 636,
      t: "Exclusive Time of Functions",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Stack"],
    },
    {
      id: 670,
      t: "Maximum Swap",
      d: "Medium",
      freq: 72,
      tags: ["Math", "Greedy"],
    },
    {
      id: 680,
      t: "Valid Palindrome II",
      d: "Easy",
      freq: 85,
      tags: ["Two Pointers", "String", "Greedy"],
    },
    {
      id: 721,
      t: "Accounts Merge",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Hash Table", "String", "DFS", "BFS", "Union Find"],
    },
    {
      id: 735,
      t: "Asteroid Collision",
      d: "Medium",
      freq: 72,
      tags: ["Array", "Stack", "Simulation"],
    },
    {
      id: 766,
      t: "Toeplitz Matrix",
      d: "Easy",
      freq: 70,
      tags: ["Array", "Matrix"],
    },
    {
      id: 791,
      t: "Custom Sort String",
      d: "Medium",
      freq: 72,
      tags: ["Hash Table", "String", "Sorting"],
    },
    {
      id: 827,
      t: "Making A Large Island",
      d: "Hard",
      freq: 65,
      tags: ["Array", "DFS", "BFS", "Union Find", "Matrix"],
    },
    {
      id: 863,
      t: "All Nodes Distance K in Binary Tree",
      d: "Medium",
      freq: 75,
      tags: ["Hash Table", "Tree", "DFS", "BFS"],
    },
    {
      id: 987,
      t: "Vertical Order Traversal of a Binary Tree",
      d: "Hard",
      freq: 70,
      tags: ["Hash Table", "Tree", "DFS", "BFS", "Sorting"],
    },
    {
      id: 1004,
      t: "Max Consecutive Ones III",
      d: "Medium",
      freq: 72,
      tags: ["Array", "Binary Search", "Sliding Window", "Prefix Sum"],
    },
    {
      id: 1091,
      t: "Shortest Path in Binary Matrix",
      d: "Medium",
      freq: 70,
      tags: ["Array", "BFS", "Matrix"],
    },
    {
      id: 1249,
      t: "Minimum Remove to Make Valid Parentheses",
      d: "Medium",
      freq: 85,
      tags: ["String", "Stack"],
    },
    {
      id: 1367,
      t: "Linked List in Binary Tree",
      d: "Medium",
      freq: 68,
      tags: ["Linked List", "Tree", "DFS", "BFS"],
    },
    {
      id: 1570,
      t: "Dot Product of Two Sparse Vectors",
      d: "Medium",
      freq: 72,
      tags: ["Array", "Hash Table", "Two Pointers", "Design"],
    },
    {
      id: 1650,
      t: "Lowest Common Ancestor of a Binary Tree III",
      d: "Medium",
      freq: 80,
      tags: ["Hash Table", "Two Pointers", "Tree"],
    },
    {
      id: 1762,
      t: "Buildings With an Ocean View",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Stack", "Monotonic Stack"],
    },
  ],
  Amazon: [
    { id: 1, t: "Two Sum", d: "Easy", freq: 95, tags: ["Array", "Hash Table"] },
    {
      id: 2,
      t: "Add Two Numbers",
      d: "Medium",
      freq: 80,
      tags: ["Linked List", "Math"],
    },
    {
      id: 3,
      t: "Longest Substring Without Repeating Characters",
      d: "Medium",
      freq: 82,
      tags: ["Hash Table", "Sliding Window"],
    },
    {
      id: 5,
      t: "Longest Palindromic Substring",
      d: "Medium",
      freq: 70,
      tags: ["String", "DP"],
    },
    {
      id: 11,
      t: "Container With Most Water",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Two Pointers", "Greedy"],
    },
    {
      id: 15,
      t: "3Sum",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Two Pointers", "Sorting"],
    },
    {
      id: 17,
      t: "Letter Combinations of a Phone Number",
      d: "Medium",
      freq: 78,
      tags: ["Hash Table", "String", "Backtracking"],
    },
    {
      id: 20,
      t: "Valid Parentheses",
      d: "Easy",
      freq: 82,
      tags: ["String", "Stack"],
    },
    {
      id: 21,
      t: "Merge Two Sorted Lists",
      d: "Easy",
      freq: 88,
      tags: ["Linked List"],
    },
    {
      id: 23,
      t: "Merge k Sorted Lists",
      d: "Hard",
      freq: 80,
      tags: ["Linked List", "Divide and Conquer", "Heap"],
    },
    {
      id: 42,
      t: "Trapping Rain Water",
      d: "Hard",
      freq: 80,
      tags: ["Array", "Two Pointers", "Stack"],
    },
    {
      id: 46,
      t: "Permutations",
      d: "Medium",
      freq: 72,
      tags: ["Array", "Backtracking"],
    },
    {
      id: 49,
      t: "Group Anagrams",
      d: "Medium",
      freq: 85,
      tags: ["Array", "Hash Table", "String", "Sorting"],
    },
    {
      id: 53,
      t: "Maximum Subarray",
      d: "Medium",
      freq: 88,
      tags: ["Array", "Divide and Conquer", "DP"],
    },
    {
      id: 54,
      t: "Spiral Matrix",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Matrix", "Simulation"],
    },
    {
      id: 56,
      t: "Merge Intervals",
      d: "Medium",
      freq: 85,
      tags: ["Array", "Sorting"],
    },
    {
      id: 62,
      t: "Unique Paths",
      d: "Medium",
      freq: 72,
      tags: ["Math", "DP", "Combinatorics"],
    },
    {
      id: 76,
      t: "Minimum Window Substring",
      d: "Hard",
      freq: 75,
      tags: ["String", "Sliding Window"],
    },
    {
      id: 98,
      t: "Validate Binary Search Tree",
      d: "Medium",
      freq: 78,
      tags: ["Tree", "DFS", "BST"],
    },
    {
      id: 102,
      t: "Binary Tree Level Order Traversal",
      d: "Medium",
      freq: 80,
      tags: ["Tree", "BFS"],
    },
    {
      id: 121,
      t: "Best Time to Buy and Sell Stock",
      d: "Easy",
      freq: 90,
      tags: ["Array", "DP"],
    },
    {
      id: 128,
      t: "Longest Consecutive Sequence",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Hash Table", "Union Find"],
    },
    {
      id: 133,
      t: "Clone Graph",
      d: "Medium",
      freq: 72,
      tags: ["Hash Table", "DFS", "BFS", "Graph"],
    },
    {
      id: 139,
      t: "Word Break",
      d: "Medium",
      freq: 82,
      tags: ["Hash Table", "String", "DP", "Trie"],
    },
    {
      id: 141,
      t: "Linked List Cycle",
      d: "Easy",
      freq: 80,
      tags: ["Hash Table", "Linked List", "Two Pointers"],
    },
    {
      id: 146,
      t: "LRU Cache",
      d: "Medium",
      freq: 88,
      tags: ["Hash Table", "Linked List", "Design"],
    },
    {
      id: 160,
      t: "Intersection of Two Linked Lists",
      d: "Easy",
      freq: 75,
      tags: ["Hash Table", "Linked List", "Two Pointers"],
    },
    {
      id: 199,
      t: "Binary Tree Right Side View",
      d: "Medium",
      freq: 78,
      tags: ["Tree", "DFS", "BFS"],
    },
    {
      id: 200,
      t: "Number of Islands",
      d: "Medium",
      freq: 85,
      tags: ["Array", "DFS", "BFS", "Union Find"],
    },
    {
      id: 206,
      t: "Reverse Linked List",
      d: "Easy",
      freq: 82,
      tags: ["Linked List", "Recursion"],
    },
    {
      id: 207,
      t: "Course Schedule",
      d: "Medium",
      freq: 75,
      tags: ["DFS", "BFS", "Graph", "Topological Sort"],
    },
    {
      id: 235,
      t: "Lowest Common Ancestor of a BST",
      d: "Medium",
      freq: 75,
      tags: ["Tree", "DFS", "BST"],
    },
    {
      id: 238,
      t: "Product of Array Except Self",
      d: "Medium",
      freq: 82,
      tags: ["Array", "Prefix Sum"],
    },
    {
      id: 239,
      t: "Sliding Window Maximum",
      d: "Hard",
      freq: 72,
      tags: ["Array", "Queue", "Sliding Window", "Deque", "Monotonic Queue"],
    },
    {
      id: 253,
      t: "Meeting Rooms II",
      d: "Medium",
      freq: 85,
      tags: ["Array", "Sorting", "Heap"],
    },
    {
      id: 269,
      t: "Alien Dictionary",
      d: "Hard",
      freq: 68,
      tags: ["Array", "String", "DFS", "BFS", "Graph", "Topological Sort"],
    },
    {
      id: 295,
      t: "Find Median from Data Stream",
      d: "Hard",
      freq: 75,
      tags: ["Sorting", "Heap", "Design"],
    },
    {
      id: 297,
      t: "Serialize and Deserialize Binary Tree",
      d: "Hard",
      freq: 72,
      tags: ["String", "Tree", "DFS", "BFS", "Design"],
    },
    {
      id: 322,
      t: "Coin Change",
      d: "Medium",
      freq: 80,
      tags: ["Array", "DP", "BFS"],
    },
    {
      id: 341,
      t: "Flatten Nested List Iterator",
      d: "Medium",
      freq: 75,
      tags: ["Stack", "Tree", "DFS", "Design", "Iterator", "Queue"],
    },
    {
      id: 347,
      t: "Top K Frequent Elements",
      d: "Medium",
      freq: 85,
      tags: ["Array", "Hash Table", "Divide and Conquer", "Sorting", "Heap"],
    },
    {
      id: 380,
      t: "Insert Delete GetRandom O(1)",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Hash Table", "Math", "Design"],
    },
    {
      id: 394,
      t: "Decode String",
      d: "Medium",
      freq: 80,
      tags: ["String", "Stack", "Recursion"],
    },
    {
      id: 460,
      t: "LFU Cache",
      d: "Hard",
      freq: 68,
      tags: ["Hash Table", "Linked List", "Design"],
    },
    {
      id: 518,
      t: "Coin Change II",
      d: "Medium",
      freq: 72,
      tags: ["Array", "DP"],
    },
    {
      id: 542,
      t: "01 Matrix",
      d: "Medium",
      freq: 75,
      tags: ["Array", "DP", "BFS", "Matrix"],
    },
    {
      id: 547,
      t: "Number of Provinces",
      d: "Medium",
      freq: 72,
      tags: ["DFS", "BFS", "Graph", "Union Find"],
    },
    {
      id: 560,
      t: "Subarray Sum Equals K",
      d: "Medium",
      freq: 82,
      tags: ["Array", "Hash Table", "Prefix Sum"],
    },
    {
      id: 621,
      t: "Task Scheduler",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Hash Table", "Greedy", "Heap"],
    },
    {
      id: 642,
      t: "Design Search Autocomplete System",
      d: "Hard",
      freq: 70,
      tags: ["String", "Design", "Trie"],
    },
    {
      id: 692,
      t: "Top K Frequent Words",
      d: "Medium",
      freq: 75,
      tags: [
        "Hash Table",
        "String",
        "Trie",
        "Sorting",
        "Heap",
        "Bucket Sort",
        "Counting",
      ],
    },
    {
      id: 721,
      t: "Accounts Merge",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Hash Table", "String", "DFS", "BFS", "Union Find"],
    },
    {
      id: 733,
      t: "Flood Fill",
      d: "Easy",
      freq: 75,
      tags: ["Array", "DFS", "BFS", "Matrix"],
    },
    {
      id: 778,
      t: "Swim in Rising Water",
      d: "Hard",
      freq: 65,
      tags: [
        "Array",
        "Binary Search",
        "DFS",
        "BFS",
        "Union Find",
        "Heap",
        "Matrix",
      ],
    },
    {
      id: 815,
      t: "Bus Routes",
      d: "Hard",
      freq: 65,
      tags: ["Array", "Hash Table", "BFS"],
    },
    {
      id: 895,
      t: "Maximum Frequency Stack",
      d: "Hard",
      freq: 68,
      tags: ["Hash Table", "Stack", "Design", "Ordered Set"],
    },
    {
      id: 937,
      t: "Reorder Data in Log Files",
      d: "Medium",
      freq: 80,
      tags: ["Array", "String", "Sorting"],
    },
    {
      id: 973,
      t: "K Closest Points to Origin",
      d: "Medium",
      freq: 85,
      tags: [
        "Array",
        "Math",
        "Divide and Conquer",
        "Sorting",
        "Heap",
        "Geometry",
      ],
    },
    {
      id: 994,
      t: "Rotting Oranges",
      d: "Medium",
      freq: 78,
      tags: ["Array", "BFS", "Matrix"],
    },
    {
      id: 1010,
      t: "Pairs of Songs With Total Durations Divisible by 60",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Hash Table", "Counting"],
    },
    {
      id: 1046,
      t: "Last Stone Weight",
      d: "Easy",
      freq: 72,
      tags: ["Array", "Heap", "Greedy"],
    },
    {
      id: 1143,
      t: "Longest Common Subsequence",
      d: "Medium",
      freq: 75,
      tags: ["String", "DP"],
    },
    {
      id: 1235,
      t: "Maximum Profit in Job Scheduling",
      d: "Hard",
      freq: 68,
      tags: ["Array", "Binary Search", "DP", "Sorting"],
    },
    {
      id: 1268,
      t: "Search Suggestions System",
      d: "Medium",
      freq: 78,
      tags: ["Array", "String", "Binary Search", "Trie", "Sorting"],
    },
    {
      id: 1472,
      t: "Design Browser History",
      d: "Medium",
      freq: 72,
      tags: [
        "Array",
        "Linked List",
        "Stack",
        "Design",
        "Doubly-Linked List",
        "Data Stream",
      ],
    },
    {
      id: 1710,
      t: "Maximum Units on a Truck",
      d: "Easy",
      freq: 72,
      tags: ["Array", "Greedy", "Sorting"],
    },
  ],
  Apple: [
    { id: 1, t: "Two Sum", d: "Easy", freq: 90, tags: ["Array", "Hash Table"] },
    {
      id: 3,
      t: "Longest Substring Without Repeating Characters",
      d: "Medium",
      freq: 82,
      tags: ["Hash Table", "Sliding Window"],
    },
    {
      id: 11,
      t: "Container With Most Water",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Two Pointers", "Greedy"],
    },
    {
      id: 15,
      t: "3Sum",
      d: "Medium",
      freq: 80,
      tags: ["Array", "Two Pointers", "Sorting"],
    },
    {
      id: 20,
      t: "Valid Parentheses",
      d: "Easy",
      freq: 82,
      tags: ["String", "Stack"],
    },
    {
      id: 21,
      t: "Merge Two Sorted Lists",
      d: "Easy",
      freq: 85,
      tags: ["Linked List"],
    },
    {
      id: 26,
      t: "Remove Duplicates from Sorted Array",
      d: "Easy",
      freq: 75,
      tags: ["Array", "Two Pointers"],
    },
    {
      id: 33,
      t: "Search in Rotated Sorted Array",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Binary Search"],
    },
    {
      id: 39,
      t: "Combination Sum",
      d: "Medium",
      freq: 72,
      tags: ["Array", "Backtracking"],
    },
    {
      id: 42,
      t: "Trapping Rain Water",
      d: "Hard",
      freq: 80,
      tags: ["Array", "Two Pointers", "Stack"],
    },
    {
      id: 46,
      t: "Permutations",
      d: "Medium",
      freq: 70,
      tags: ["Array", "Backtracking"],
    },
    {
      id: 48,
      t: "Rotate Image",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Math", "Matrix"],
    },
    {
      id: 54,
      t: "Spiral Matrix",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Matrix", "Simulation"],
    },
    {
      id: 73,
      t: "Set Matrix Zeroes",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Hash Table", "Matrix"],
    },
    {
      id: 78,
      t: "Subsets",
      d: "Medium",
      freq: 72,
      tags: ["Array", "Backtracking", "Bit Manipulation"],
    },
    { id: 91, t: "Decode Ways", d: "Medium", freq: 72, tags: ["String", "DP"] },
    {
      id: 98,
      t: "Validate Binary Search Tree",
      d: "Medium",
      freq: 78,
      tags: ["Tree", "DFS", "BST"],
    },
    {
      id: 102,
      t: "Binary Tree Level Order Traversal",
      d: "Medium",
      freq: 78,
      tags: ["Tree", "BFS"],
    },
    {
      id: 104,
      t: "Maximum Depth of Binary Tree",
      d: "Easy",
      freq: 78,
      tags: ["Tree", "DFS", "BFS"],
    },
    {
      id: 121,
      t: "Best Time to Buy and Sell Stock",
      d: "Easy",
      freq: 88,
      tags: ["Array", "DP"],
    },
    {
      id: 141,
      t: "Linked List Cycle",
      d: "Easy",
      freq: 78,
      tags: ["Hash Table", "Linked List", "Two Pointers"],
    },
    {
      id: 142,
      t: "Linked List Cycle II",
      d: "Medium",
      freq: 72,
      tags: ["Hash Table", "Linked List", "Two Pointers"],
    },
    {
      id: 146,
      t: "LRU Cache",
      d: "Medium",
      freq: 85,
      tags: ["Hash Table", "Linked List", "Design"],
    },
    {
      id: 152,
      t: "Maximum Product Subarray",
      d: "Medium",
      freq: 72,
      tags: ["Array", "DP"],
    },
    {
      id: 200,
      t: "Number of Islands",
      d: "Medium",
      freq: 82,
      tags: ["Array", "DFS", "BFS", "Union Find"],
    },
    {
      id: 206,
      t: "Reverse Linked List",
      d: "Easy",
      freq: 82,
      tags: ["Linked List", "Recursion"],
    },
    {
      id: 207,
      t: "Course Schedule",
      d: "Medium",
      freq: 72,
      tags: ["DFS", "BFS", "Graph", "Topological Sort"],
    },
    {
      id: 212,
      t: "Word Search II",
      d: "Hard",
      freq: 65,
      tags: ["Array", "String", "Backtracking", "Trie"],
    },
    {
      id: 224,
      t: "Basic Calculator",
      d: "Hard",
      freq: 72,
      tags: ["Math", "String", "Stack", "Recursion"],
    },
    {
      id: 232,
      t: "Implement Queue using Stacks",
      d: "Easy",
      freq: 70,
      tags: ["Stack", "Design", "Queue"],
    },
    {
      id: 236,
      t: "Lowest Common Ancestor of a Binary Tree",
      d: "Medium",
      freq: 80,
      tags: ["Tree", "DFS"],
    },
    {
      id: 238,
      t: "Product of Array Except Self",
      d: "Medium",
      freq: 82,
      tags: ["Array", "Prefix Sum"],
    },
    {
      id: 239,
      t: "Sliding Window Maximum",
      d: "Hard",
      freq: 70,
      tags: ["Array", "Queue", "Sliding Window", "Deque", "Monotonic Queue"],
    },
    {
      id: 253,
      t: "Meeting Rooms II",
      d: "Medium",
      freq: 82,
      tags: ["Array", "Sorting", "Heap"],
    },
    {
      id: 295,
      t: "Find Median from Data Stream",
      d: "Hard",
      freq: 72,
      tags: ["Sorting", "Heap", "Design"],
    },
    {
      id: 322,
      t: "Coin Change",
      d: "Medium",
      freq: 78,
      tags: ["Array", "DP", "BFS"],
    },
    {
      id: 347,
      t: "Top K Frequent Elements",
      d: "Medium",
      freq: 82,
      tags: ["Array", "Hash Table", "Sorting", "Heap"],
    },
    {
      id: 394,
      t: "Decode String",
      d: "Medium",
      freq: 75,
      tags: ["String", "Stack", "Recursion"],
    },
    {
      id: 424,
      t: "Longest Repeating Character Replacement",
      d: "Medium",
      freq: 72,
      tags: ["Hash Table", "String", "Sliding Window"],
    },
    {
      id: 443,
      t: "String Compression",
      d: "Medium",
      freq: 78,
      tags: ["Two Pointers", "String"],
    },
    {
      id: 528,
      t: "Random Pick with Weight",
      d: "Medium",
      freq: 72,
      tags: ["Math", "Binary Search", "Prefix Sum", "Randomized"],
    },
    {
      id: 543,
      t: "Diameter of Binary Tree",
      d: "Easy",
      freq: 78,
      tags: ["Tree", "DFS"],
    },
    {
      id: 560,
      t: "Subarray Sum Equals K",
      d: "Medium",
      freq: 80,
      tags: ["Array", "Hash Table", "Prefix Sum"],
    },
    {
      id: 617,
      t: "Merge Two Binary Trees",
      d: "Easy",
      freq: 72,
      tags: ["Tree", "DFS", "BFS"],
    },
    {
      id: 680,
      t: "Valid Palindrome II",
      d: "Easy",
      freq: 78,
      tags: ["Two Pointers", "String", "Greedy"],
    },
    {
      id: 700,
      t: "Search in a Binary Search Tree",
      d: "Easy",
      freq: 70,
      tags: ["Tree", "BST"],
    },
    {
      id: 735,
      t: "Asteroid Collision",
      d: "Medium",
      freq: 72,
      tags: ["Array", "Stack", "Simulation"],
    },
    {
      id: 752,
      t: "Open the Lock",
      d: "Medium",
      freq: 68,
      tags: ["Array", "Hash Table", "String", "BFS"],
    },
    {
      id: 863,
      t: "All Nodes Distance K in Binary Tree",
      d: "Medium",
      freq: 72,
      tags: ["Hash Table", "Tree", "DFS", "BFS"],
    },
    {
      id: 973,
      t: "K Closest Points to Origin",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Math", "Sorting", "Heap", "Geometry"],
    },
    {
      id: 1011,
      t: "Capacity To Ship Packages Within D Days",
      d: "Medium",
      freq: 72,
      tags: ["Array", "Binary Search"],
    },
    {
      id: 1047,
      t: "Remove All Adjacent Duplicates In String",
      d: "Easy",
      freq: 70,
      tags: ["String", "Stack"],
    },
    {
      id: 1143,
      t: "Longest Common Subsequence",
      d: "Medium",
      freq: 72,
      tags: ["String", "DP"],
    },
    {
      id: 1209,
      t: "Remove All Adjacent Duplicates in String II",
      d: "Medium",
      freq: 70,
      tags: ["String", "Stack"],
    },
  ],
  Netflix: [
    { id: 1, t: "Two Sum", d: "Easy", freq: 85, tags: ["Array", "Hash Table"] },
    {
      id: 3,
      t: "Longest Substring Without Repeating Characters",
      d: "Medium",
      freq: 80,
      tags: ["Hash Table", "Sliding Window"],
    },
    {
      id: 20,
      t: "Valid Parentheses",
      d: "Easy",
      freq: 78,
      tags: ["String", "Stack"],
    },
    {
      id: 42,
      t: "Trapping Rain Water",
      d: "Hard",
      freq: 78,
      tags: ["Array", "Two Pointers", "Stack"],
    },
    {
      id: 49,
      t: "Group Anagrams",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Hash Table", "String", "Sorting"],
    },
    {
      id: 53,
      t: "Maximum Subarray",
      d: "Medium",
      freq: 80,
      tags: ["Array", "Divide and Conquer", "DP"],
    },
    {
      id: 56,
      t: "Merge Intervals",
      d: "Medium",
      freq: 82,
      tags: ["Array", "Sorting"],
    },
    {
      id: 76,
      t: "Minimum Window Substring",
      d: "Hard",
      freq: 75,
      tags: ["String", "Sliding Window"],
    },
    {
      id: 84,
      t: "Largest Rectangle in Histogram",
      d: "Hard",
      freq: 68,
      tags: ["Array", "Stack", "Monotonic Stack"],
    },
    {
      id: 121,
      t: "Best Time to Buy and Sell Stock",
      d: "Easy",
      freq: 85,
      tags: ["Array", "DP"],
    },
    {
      id: 127,
      t: "Word Ladder",
      d: "Hard",
      freq: 70,
      tags: ["BFS", "Hash Table"],
    },
    {
      id: 146,
      t: "LRU Cache",
      d: "Medium",
      freq: 88,
      tags: ["Hash Table", "Linked List", "Design"],
    },
    {
      id: 152,
      t: "Maximum Product Subarray",
      d: "Medium",
      freq: 72,
      tags: ["Array", "DP"],
    },
    {
      id: 200,
      t: "Number of Islands",
      d: "Medium",
      freq: 80,
      tags: ["Array", "DFS", "BFS", "Union Find"],
    },
    {
      id: 206,
      t: "Reverse Linked List",
      d: "Easy",
      freq: 78,
      tags: ["Linked List", "Recursion"],
    },
    {
      id: 207,
      t: "Course Schedule",
      d: "Medium",
      freq: 75,
      tags: ["DFS", "BFS", "Graph", "Topological Sort"],
    },
    {
      id: 215,
      t: "Kth Largest Element in an Array",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Divide and Conquer", "Sorting", "Heap", "Quickselect"],
    },
    {
      id: 238,
      t: "Product of Array Except Self",
      d: "Medium",
      freq: 80,
      tags: ["Array", "Prefix Sum"],
    },
    {
      id: 253,
      t: "Meeting Rooms II",
      d: "Medium",
      freq: 80,
      tags: ["Array", "Sorting", "Heap"],
    },
    {
      id: 295,
      t: "Find Median from Data Stream",
      d: "Hard",
      freq: 72,
      tags: ["Sorting", "Heap", "Design"],
    },
    {
      id: 297,
      t: "Serialize and Deserialize Binary Tree",
      d: "Hard",
      freq: 70,
      tags: ["String", "Tree", "DFS", "BFS", "Design"],
    },
    {
      id: 322,
      t: "Coin Change",
      d: "Medium",
      freq: 75,
      tags: ["Array", "DP", "BFS"],
    },
    {
      id: 347,
      t: "Top K Frequent Elements",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Hash Table", "Sorting", "Heap"],
    },
    {
      id: 380,
      t: "Insert Delete GetRandom O(1)",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Hash Table", "Math", "Design"],
    },
    {
      id: 460,
      t: "LFU Cache",
      d: "Hard",
      freq: 70,
      tags: ["Hash Table", "Linked List", "Design"],
    },
    {
      id: 543,
      t: "Diameter of Binary Tree",
      d: "Easy",
      freq: 72,
      tags: ["Tree", "DFS"],
    },
    {
      id: 560,
      t: "Subarray Sum Equals K",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Hash Table", "Prefix Sum"],
    },
    {
      id: 621,
      t: "Task Scheduler",
      d: "Medium",
      freq: 72,
      tags: ["Array", "Hash Table", "Greedy", "Heap"],
    },
    {
      id: 642,
      t: "Design Search Autocomplete System",
      d: "Hard",
      freq: 68,
      tags: ["String", "Design", "Trie"],
    },
    {
      id: 829,
      t: "Consecutive Numbers Sum",
      d: "Hard",
      freq: 65,
      tags: ["Math"],
    },
    {
      id: 895,
      t: "Maximum Frequency Stack",
      d: "Hard",
      freq: 68,
      tags: ["Hash Table", "Stack", "Design"],
    },
    {
      id: 973,
      t: "K Closest Points to Origin",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Math", "Sorting", "Heap", "Geometry"],
    },
    {
      id: 1143,
      t: "Longest Common Subsequence",
      d: "Medium",
      freq: 70,
      tags: ["String", "DP"],
    },
  ],
  Microsoft: [
    { id: 1, t: "Two Sum", d: "Easy", freq: 95, tags: ["Array", "Hash Table"] },
    {
      id: 2,
      t: "Add Two Numbers",
      d: "Medium",
      freq: 90,
      tags: ["Linked List", "Math"],
    },
    {
      id: 3,
      t: "Longest Substring Without Repeating Characters",
      d: "Medium",
      freq: 85,
      tags: ["Hash Table", "Sliding Window"],
    },
    { id: 7, t: "Reverse Integer", d: "Medium", freq: 78, tags: ["Math"] },
    {
      id: 11,
      t: "Container With Most Water",
      d: "Medium",
      freq: 80,
      tags: ["Array", "Two Pointers", "Greedy"],
    },
    {
      id: 13,
      t: "Roman to Integer",
      d: "Easy",
      freq: 75,
      tags: ["Hash Table", "Math", "String"],
    },
    {
      id: 15,
      t: "3Sum",
      d: "Medium",
      freq: 80,
      tags: ["Array", "Two Pointers", "Sorting"],
    },
    {
      id: 19,
      t: "Remove Nth Node From End of List",
      d: "Medium",
      freq: 75,
      tags: ["Linked List", "Two Pointers"],
    },
    {
      id: 20,
      t: "Valid Parentheses",
      d: "Easy",
      freq: 85,
      tags: ["String", "Stack"],
    },
    {
      id: 21,
      t: "Merge Two Sorted Lists",
      d: "Easy",
      freq: 88,
      tags: ["Linked List"],
    },
    {
      id: 22,
      t: "Generate Parentheses",
      d: "Medium",
      freq: 78,
      tags: ["String", "DP", "Backtracking"],
    },
    {
      id: 33,
      t: "Search in Rotated Sorted Array",
      d: "Medium",
      freq: 80,
      tags: ["Array", "Binary Search"],
    },
    {
      id: 42,
      t: "Trapping Rain Water",
      d: "Hard",
      freq: 78,
      tags: ["Array", "Two Pointers", "Stack"],
    },
    {
      id: 46,
      t: "Permutations",
      d: "Medium",
      freq: 72,
      tags: ["Array", "Backtracking"],
    },
    {
      id: 48,
      t: "Rotate Image",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Math", "Matrix"],
    },
    {
      id: 49,
      t: "Group Anagrams",
      d: "Medium",
      freq: 80,
      tags: ["Array", "Hash Table", "String", "Sorting"],
    },
    {
      id: 53,
      t: "Maximum Subarray",
      d: "Medium",
      freq: 85,
      tags: ["Array", "Divide and Conquer", "DP"],
    },
    {
      id: 54,
      t: "Spiral Matrix",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Matrix", "Simulation"],
    },
    {
      id: 55,
      t: "Jump Game",
      d: "Medium",
      freq: 75,
      tags: ["Array", "DP", "Greedy"],
    },
    {
      id: 56,
      t: "Merge Intervals",
      d: "Medium",
      freq: 85,
      tags: ["Array", "Sorting"],
    },
    {
      id: 62,
      t: "Unique Paths",
      d: "Medium",
      freq: 78,
      tags: ["Math", "DP", "Combinatorics"],
    },
    {
      id: 70,
      t: "Climbing Stairs",
      d: "Easy",
      freq: 78,
      tags: ["Math", "DP", "Memoization"],
    },
    {
      id: 78,
      t: "Subsets",
      d: "Medium",
      freq: 72,
      tags: ["Array", "Backtracking", "Bit Manipulation"],
    },
    { id: 91, t: "Decode Ways", d: "Medium", freq: 72, tags: ["String", "DP"] },
    {
      id: 98,
      t: "Validate Binary Search Tree",
      d: "Medium",
      freq: 82,
      tags: ["Tree", "DFS", "BST"],
    },
    {
      id: 100,
      t: "Same Tree",
      d: "Easy",
      freq: 72,
      tags: ["Tree", "DFS", "BFS"],
    },
    {
      id: 101,
      t: "Symmetric Tree",
      d: "Easy",
      freq: 75,
      tags: ["Tree", "DFS", "BFS"],
    },
    {
      id: 102,
      t: "Binary Tree Level Order Traversal",
      d: "Medium",
      freq: 85,
      tags: ["Tree", "BFS"],
    },
    {
      id: 104,
      t: "Maximum Depth of Binary Tree",
      d: "Easy",
      freq: 80,
      tags: ["Tree", "DFS", "BFS"],
    },
    {
      id: 112,
      t: "Path Sum",
      d: "Easy",
      freq: 72,
      tags: ["Tree", "DFS", "BFS"],
    },
    {
      id: 121,
      t: "Best Time to Buy and Sell Stock",
      d: "Easy",
      freq: 88,
      tags: ["Array", "DP"],
    },
    {
      id: 128,
      t: "Longest Consecutive Sequence",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Hash Table", "Union Find"],
    },
    {
      id: 139,
      t: "Word Break",
      d: "Medium",
      freq: 78,
      tags: ["Hash Table", "String", "DP", "Trie"],
    },
    {
      id: 141,
      t: "Linked List Cycle",
      d: "Easy",
      freq: 80,
      tags: ["Hash Table", "Linked List", "Two Pointers"],
    },
    {
      id: 146,
      t: "LRU Cache",
      d: "Medium",
      freq: 88,
      tags: ["Hash Table", "Linked List", "Design"],
    },
    {
      id: 153,
      t: "Find Minimum in Rotated Sorted Array",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Binary Search"],
    },
    {
      id: 160,
      t: "Intersection of Two Linked Lists",
      d: "Easy",
      freq: 75,
      tags: ["Hash Table", "Linked List", "Two Pointers"],
    },
    {
      id: 199,
      t: "Binary Tree Right Side View",
      d: "Medium",
      freq: 78,
      tags: ["Tree", "DFS", "BFS"],
    },
    {
      id: 200,
      t: "Number of Islands",
      d: "Medium",
      freq: 82,
      tags: ["Array", "DFS", "BFS", "Union Find"],
    },
    {
      id: 206,
      t: "Reverse Linked List",
      d: "Easy",
      freq: 88,
      tags: ["Linked List", "Recursion"],
    },
    {
      id: 207,
      t: "Course Schedule",
      d: "Medium",
      freq: 78,
      tags: ["DFS", "BFS", "Graph", "Topological Sort"],
    },
    {
      id: 226,
      t: "Invert Binary Tree",
      d: "Easy",
      freq: 78,
      tags: ["Tree", "DFS", "BFS"],
    },
    {
      id: 230,
      t: "Kth Smallest Element in a BST",
      d: "Medium",
      freq: 75,
      tags: ["Tree", "DFS", "BST", "Iterator"],
    },
    {
      id: 234,
      t: "Palindrome Linked List",
      d: "Easy",
      freq: 75,
      tags: ["Linked List", "Two Pointers", "Stack", "Recursion"],
    },
    {
      id: 235,
      t: "Lowest Common Ancestor of a BST",
      d: "Medium",
      freq: 75,
      tags: ["Tree", "DFS", "BST"],
    },
    {
      id: 236,
      t: "Lowest Common Ancestor of a Binary Tree",
      d: "Medium",
      freq: 82,
      tags: ["Tree", "DFS"],
    },
    {
      id: 238,
      t: "Product of Array Except Self",
      d: "Medium",
      freq: 82,
      tags: ["Array", "Prefix Sum"],
    },
    {
      id: 253,
      t: "Meeting Rooms II",
      d: "Medium",
      freq: 82,
      tags: ["Array", "Sorting", "Heap"],
    },
    {
      id: 295,
      t: "Find Median from Data Stream",
      d: "Hard",
      freq: 72,
      tags: ["Sorting", "Heap", "Design"],
    },
    {
      id: 297,
      t: "Serialize and Deserialize Binary Tree",
      d: "Hard",
      freq: 70,
      tags: ["String", "Tree", "DFS", "BFS", "Design"],
    },
    {
      id: 322,
      t: "Coin Change",
      d: "Medium",
      freq: 80,
      tags: ["Array", "DP", "BFS"],
    },
    {
      id: 341,
      t: "Flatten Nested List Iterator",
      d: "Medium",
      freq: 72,
      tags: ["Stack", "Tree", "DFS", "Design", "Iterator"],
    },
    {
      id: 347,
      t: "Top K Frequent Elements",
      d: "Medium",
      freq: 82,
      tags: ["Array", "Hash Table", "Sorting", "Heap"],
    },
    {
      id: 394,
      t: "Decode String",
      d: "Medium",
      freq: 78,
      tags: ["String", "Stack", "Recursion"],
    },
    {
      id: 438,
      t: "Find All Anagrams in a String",
      d: "Medium",
      freq: 75,
      tags: ["Hash Table", "String", "Sliding Window"],
    },
    {
      id: 463,
      t: "Island Perimeter",
      d: "Easy",
      freq: 70,
      tags: ["Array", "DFS", "BFS", "Matrix"],
    },
    {
      id: 543,
      t: "Diameter of Binary Tree",
      d: "Easy",
      freq: 78,
      tags: ["Tree", "DFS"],
    },
    {
      id: 560,
      t: "Subarray Sum Equals K",
      d: "Medium",
      freq: 80,
      tags: ["Array", "Hash Table", "Prefix Sum"],
    },
    {
      id: 572,
      t: "Subtree of Another Tree",
      d: "Easy",
      freq: 75,
      tags: ["Tree", "DFS", "Hash Function"],
    },
    {
      id: 621,
      t: "Task Scheduler",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Hash Table", "Greedy", "Heap"],
    },
    {
      id: 647,
      t: "Palindromic Substrings",
      d: "Medium",
      freq: 72,
      tags: ["String", "DP"],
    },
    {
      id: 695,
      t: "Max Area of Island",
      d: "Medium",
      freq: 80,
      tags: ["Array", "DFS", "BFS", "Union Find", "Matrix"],
    },
    {
      id: 733,
      t: "Flood Fill",
      d: "Easy",
      freq: 78,
      tags: ["Array", "DFS", "BFS", "Matrix"],
    },
    {
      id: 973,
      t: "K Closest Points to Origin",
      d: "Medium",
      freq: 80,
      tags: ["Array", "Math", "Sorting", "Heap", "Geometry"],
    },
    {
      id: 994,
      t: "Rotting Oranges",
      d: "Medium",
      freq: 75,
      tags: ["Array", "BFS", "Matrix"],
    },
    {
      id: 1046,
      t: "Last Stone Weight",
      d: "Easy",
      freq: 75,
      tags: ["Array", "Heap", "Greedy"],
    },
    {
      id: 1143,
      t: "Longest Common Subsequence",
      d: "Medium",
      freq: 78,
      tags: ["String", "DP"],
    },
    {
      id: 1448,
      t: "Count Good Nodes in Binary Tree",
      d: "Medium",
      freq: 70,
      tags: ["Tree", "DFS", "BFS"],
    },
    {
      id: 1480,
      t: "Running Sum of 1d Array",
      d: "Easy",
      freq: 72,
      tags: ["Array", "Prefix Sum"],
    },
  ],
  Adobe: [
    { id: 1, t: "Two Sum", d: "Easy", freq: 88, tags: ["Array", "Hash Table"] },
    {
      id: 2,
      t: "Add Two Numbers",
      d: "Medium",
      freq: 82,
      tags: ["Linked List", "Math"],
    },
    {
      id: 3,
      t: "Longest Substring Without Repeating Characters",
      d: "Medium",
      freq: 80,
      tags: ["Hash Table", "Sliding Window"],
    },
    { id: 7, t: "Reverse Integer", d: "Medium", freq: 75, tags: ["Math"] },
    {
      id: 15,
      t: "3Sum",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Two Pointers", "Sorting"],
    },
    {
      id: 20,
      t: "Valid Parentheses",
      d: "Easy",
      freq: 82,
      tags: ["String", "Stack"],
    },
    {
      id: 21,
      t: "Merge Two Sorted Lists",
      d: "Easy",
      freq: 80,
      tags: ["Linked List"],
    },
    {
      id: 22,
      t: "Generate Parentheses",
      d: "Medium",
      freq: 75,
      tags: ["String", "DP", "Backtracking"],
    },
    {
      id: 33,
      t: "Search in Rotated Sorted Array",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Binary Search"],
    },
    {
      id: 46,
      t: "Permutations",
      d: "Medium",
      freq: 72,
      tags: ["Array", "Backtracking"],
    },
    {
      id: 48,
      t: "Rotate Image",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Math", "Matrix"],
    },
    {
      id: 49,
      t: "Group Anagrams",
      d: "Medium",
      freq: 80,
      tags: ["Array", "Hash Table", "String", "Sorting"],
    },
    {
      id: 53,
      t: "Maximum Subarray",
      d: "Medium",
      freq: 82,
      tags: ["Array", "Divide and Conquer", "DP"],
    },
    {
      id: 54,
      t: "Spiral Matrix",
      d: "Medium",
      freq: 82,
      tags: ["Array", "Matrix", "Simulation"],
    },
    {
      id: 56,
      t: "Merge Intervals",
      d: "Medium",
      freq: 82,
      tags: ["Array", "Sorting"],
    },
    {
      id: 62,
      t: "Unique Paths",
      d: "Medium",
      freq: 70,
      tags: ["Math", "DP", "Combinatorics"],
    },
    {
      id: 70,
      t: "Climbing Stairs",
      d: "Easy",
      freq: 75,
      tags: ["Math", "DP", "Memoization"],
    },
    {
      id: 73,
      t: "Set Matrix Zeroes",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Hash Table", "Matrix"],
    },
    {
      id: 78,
      t: "Subsets",
      d: "Medium",
      freq: 70,
      tags: ["Array", "Backtracking", "Bit Manipulation"],
    },
    { id: 91, t: "Decode Ways", d: "Medium", freq: 70, tags: ["String", "DP"] },
    {
      id: 98,
      t: "Validate Binary Search Tree",
      d: "Medium",
      freq: 75,
      tags: ["Tree", "DFS", "BST"],
    },
    {
      id: 102,
      t: "Binary Tree Level Order Traversal",
      d: "Medium",
      freq: 78,
      tags: ["Tree", "BFS"],
    },
    {
      id: 104,
      t: "Maximum Depth of Binary Tree",
      d: "Easy",
      freq: 75,
      tags: ["Tree", "DFS", "BFS"],
    },
    {
      id: 121,
      t: "Best Time to Buy and Sell Stock",
      d: "Easy",
      freq: 85,
      tags: ["Array", "DP"],
    },
    {
      id: 128,
      t: "Longest Consecutive Sequence",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Hash Table", "Union Find"],
    },
    {
      id: 139,
      t: "Word Break",
      d: "Medium",
      freq: 72,
      tags: ["Hash Table", "String", "DP", "Trie"],
    },
    {
      id: 146,
      t: "LRU Cache",
      d: "Medium",
      freq: 85,
      tags: ["Hash Table", "Linked List", "Design"],
    },
    {
      id: 152,
      t: "Maximum Product Subarray",
      d: "Medium",
      freq: 72,
      tags: ["Array", "DP"],
    },
    {
      id: 198,
      t: "House Robber",
      d: "Medium",
      freq: 72,
      tags: ["Array", "DP"],
    },
    {
      id: 200,
      t: "Number of Islands",
      d: "Medium",
      freq: 80,
      tags: ["Array", "DFS", "BFS", "Union Find"],
    },
    {
      id: 206,
      t: "Reverse Linked List",
      d: "Easy",
      freq: 82,
      tags: ["Linked List", "Recursion"],
    },
    {
      id: 215,
      t: "Kth Largest Element in an Array",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Divide and Conquer", "Sorting", "Heap", "Quickselect"],
    },
    {
      id: 226,
      t: "Invert Binary Tree",
      d: "Easy",
      freq: 72,
      tags: ["Tree", "DFS", "BFS"],
    },
    {
      id: 230,
      t: "Kth Smallest Element in a BST",
      d: "Medium",
      freq: 72,
      tags: ["Tree", "DFS", "BST"],
    },
    {
      id: 234,
      t: "Palindrome Linked List",
      d: "Easy",
      freq: 72,
      tags: ["Linked List", "Two Pointers", "Stack", "Recursion"],
    },
    {
      id: 236,
      t: "Lowest Common Ancestor of a Binary Tree",
      d: "Medium",
      freq: 75,
      tags: ["Tree", "DFS"],
    },
    {
      id: 238,
      t: "Product of Array Except Self",
      d: "Medium",
      freq: 80,
      tags: ["Array", "Prefix Sum"],
    },
    {
      id: 253,
      t: "Meeting Rooms II",
      d: "Medium",
      freq: 80,
      tags: ["Array", "Sorting", "Heap"],
    },
    {
      id: 283,
      t: "Move Zeroes",
      d: "Easy",
      freq: 78,
      tags: ["Array", "Two Pointers"],
    },
    {
      id: 322,
      t: "Coin Change",
      d: "Medium",
      freq: 78,
      tags: ["Array", "DP", "BFS"],
    },
    {
      id: 347,
      t: "Top K Frequent Elements",
      d: "Medium",
      freq: 80,
      tags: ["Array", "Hash Table", "Sorting", "Heap"],
    },
    {
      id: 394,
      t: "Decode String",
      d: "Medium",
      freq: 75,
      tags: ["String", "Stack", "Recursion"],
    },
    {
      id: 438,
      t: "Find All Anagrams in a String",
      d: "Medium",
      freq: 72,
      tags: ["Hash Table", "String", "Sliding Window"],
    },
    {
      id: 543,
      t: "Diameter of Binary Tree",
      d: "Easy",
      freq: 72,
      tags: ["Tree", "DFS"],
    },
    {
      id: 560,
      t: "Subarray Sum Equals K",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Hash Table", "Prefix Sum"],
    },
    {
      id: 572,
      t: "Subtree of Another Tree",
      d: "Easy",
      freq: 70,
      tags: ["Tree", "DFS", "Hash Function"],
    },
    {
      id: 621,
      t: "Task Scheduler",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Hash Table", "Greedy", "Heap"],
    },
    {
      id: 647,
      t: "Palindromic Substrings",
      d: "Medium",
      freq: 70,
      tags: ["String", "DP"],
    },
    {
      id: 695,
      t: "Max Area of Island",
      d: "Medium",
      freq: 72,
      tags: ["Array", "DFS", "BFS", "Union Find", "Matrix"],
    },
    {
      id: 733,
      t: "Flood Fill",
      d: "Easy",
      freq: 72,
      tags: ["Array", "DFS", "BFS", "Matrix"],
    },
    {
      id: 973,
      t: "K Closest Points to Origin",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Math", "Sorting", "Heap", "Geometry"],
    },
    {
      id: 994,
      t: "Rotting Oranges",
      d: "Medium",
      freq: 72,
      tags: ["Array", "BFS", "Matrix"],
    },
    {
      id: 1143,
      t: "Longest Common Subsequence",
      d: "Medium",
      freq: 75,
      tags: ["String", "DP"],
    },
    {
      id: 1335,
      t: "Minimum Difficulty of a Job Schedule",
      d: "Hard",
      freq: 65,
      tags: ["Array", "DP"],
    },
  ],
  Uber: [
    { id: 1, t: "Two Sum", d: "Easy", freq: 92, tags: ["Array", "Hash Table"] },
    {
      id: 2,
      t: "Add Two Numbers",
      d: "Medium",
      freq: 85,
      tags: ["Linked List", "Math"],
    },
    {
      id: 3,
      t: "Longest Substring Without Repeating Characters",
      d: "Medium",
      freq: 82,
      tags: ["Hash Table", "Sliding Window"],
    },
    {
      id: 15,
      t: "3Sum",
      d: "Medium",
      freq: 82,
      tags: ["Array", "Two Pointers", "Sorting"],
    },
    {
      id: 17,
      t: "Letter Combinations of a Phone Number",
      d: "Medium",
      freq: 75,
      tags: ["Hash Table", "String", "Backtracking"],
    },
    {
      id: 20,
      t: "Valid Parentheses",
      d: "Easy",
      freq: 80,
      tags: ["String", "Stack"],
    },
    {
      id: 21,
      t: "Merge Two Sorted Lists",
      d: "Easy",
      freq: 80,
      tags: ["Linked List"],
    },
    {
      id: 33,
      t: "Search in Rotated Sorted Array",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Binary Search"],
    },
    {
      id: 42,
      t: "Trapping Rain Water",
      d: "Hard",
      freq: 80,
      tags: ["Array", "Two Pointers", "Stack"],
    },
    {
      id: 49,
      t: "Group Anagrams",
      d: "Medium",
      freq: 82,
      tags: ["Array", "Hash Table", "String", "Sorting"],
    },
    {
      id: 53,
      t: "Maximum Subarray",
      d: "Medium",
      freq: 80,
      tags: ["Array", "Divide and Conquer", "DP"],
    },
    {
      id: 56,
      t: "Merge Intervals",
      d: "Medium",
      freq: 85,
      tags: ["Array", "Sorting"],
    },
    {
      id: 76,
      t: "Minimum Window Substring",
      d: "Hard",
      freq: 75,
      tags: ["String", "Sliding Window"],
    },
    {
      id: 102,
      t: "Binary Tree Level Order Traversal",
      d: "Medium",
      freq: 75,
      tags: ["Tree", "BFS"],
    },
    {
      id: 121,
      t: "Best Time to Buy and Sell Stock",
      d: "Easy",
      freq: 88,
      tags: ["Array", "DP"],
    },
    {
      id: 127,
      t: "Word Ladder",
      d: "Hard",
      freq: 68,
      tags: ["BFS", "Hash Table"],
    },
    {
      id: 128,
      t: "Longest Consecutive Sequence",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Hash Table", "Union Find"],
    },
    {
      id: 139,
      t: "Word Break",
      d: "Medium",
      freq: 75,
      tags: ["Hash Table", "String", "DP", "Trie"],
    },
    {
      id: 146,
      t: "LRU Cache",
      d: "Medium",
      freq: 88,
      tags: ["Hash Table", "Linked List", "Design"],
    },
    {
      id: 200,
      t: "Number of Islands",
      d: "Medium",
      freq: 82,
      tags: ["Array", "DFS", "BFS", "Union Find"],
    },
    {
      id: 206,
      t: "Reverse Linked List",
      d: "Easy",
      freq: 82,
      tags: ["Linked List", "Recursion"],
    },
    {
      id: 207,
      t: "Course Schedule",
      d: "Medium",
      freq: 72,
      tags: ["DFS", "BFS", "Graph", "Topological Sort"],
    },
    {
      id: 215,
      t: "Kth Largest Element in an Array",
      d: "Medium",
      freq: 80,
      tags: ["Array", "Divide and Conquer", "Sorting", "Heap", "Quickselect"],
    },
    {
      id: 236,
      t: "Lowest Common Ancestor of a Binary Tree",
      d: "Medium",
      freq: 78,
      tags: ["Tree", "DFS"],
    },
    {
      id: 238,
      t: "Product of Array Except Self",
      d: "Medium",
      freq: 82,
      tags: ["Array", "Prefix Sum"],
    },
    {
      id: 253,
      t: "Meeting Rooms II",
      d: "Medium",
      freq: 85,
      tags: ["Array", "Sorting", "Heap"],
    },
    {
      id: 269,
      t: "Alien Dictionary",
      d: "Hard",
      freq: 65,
      tags: ["Array", "String", "DFS", "BFS", "Graph", "Topological Sort"],
    },
    {
      id: 295,
      t: "Find Median from Data Stream",
      d: "Hard",
      freq: 72,
      tags: ["Sorting", "Heap", "Design"],
    },
    {
      id: 297,
      t: "Serialize and Deserialize Binary Tree",
      d: "Hard",
      freq: 68,
      tags: ["String", "Tree", "DFS", "BFS", "Design"],
    },
    {
      id: 322,
      t: "Coin Change",
      d: "Medium",
      freq: 78,
      tags: ["Array", "DP", "BFS"],
    },
    {
      id: 347,
      t: "Top K Frequent Elements",
      d: "Medium",
      freq: 82,
      tags: ["Array", "Hash Table", "Sorting", "Heap"],
    },
    {
      id: 380,
      t: "Insert Delete GetRandom O(1)",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Hash Table", "Math", "Design"],
    },
    {
      id: 394,
      t: "Decode String",
      d: "Medium",
      freq: 75,
      tags: ["String", "Stack", "Recursion"],
    },
    {
      id: 460,
      t: "LFU Cache",
      d: "Hard",
      freq: 65,
      tags: ["Hash Table", "Linked List", "Design"],
    },
    {
      id: 543,
      t: "Diameter of Binary Tree",
      d: "Easy",
      freq: 75,
      tags: ["Tree", "DFS"],
    },
    {
      id: 560,
      t: "Subarray Sum Equals K",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Hash Table", "Prefix Sum"],
    },
    {
      id: 621,
      t: "Task Scheduler",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Hash Table", "Greedy", "Heap"],
    },
    {
      id: 642,
      t: "Design Search Autocomplete System",
      d: "Hard",
      freq: 65,
      tags: ["String", "Design", "Trie"],
    },
    {
      id: 695,
      t: "Max Area of Island",
      d: "Medium",
      freq: 75,
      tags: ["Array", "DFS", "BFS", "Union Find", "Matrix"],
    },
    {
      id: 735,
      t: "Asteroid Collision",
      d: "Medium",
      freq: 72,
      tags: ["Array", "Stack", "Simulation"],
    },
    {
      id: 973,
      t: "K Closest Points to Origin",
      d: "Medium",
      freq: 85,
      tags: ["Array", "Math", "Sorting", "Heap", "Geometry"],
    },
    {
      id: 994,
      t: "Rotting Oranges",
      d: "Medium",
      freq: 72,
      tags: ["Array", "BFS", "Matrix"],
    },
    {
      id: 1091,
      t: "Shortest Path in Binary Matrix",
      d: "Medium",
      freq: 68,
      tags: ["Array", "BFS", "Matrix"],
    },
    {
      id: 1143,
      t: "Longest Common Subsequence",
      d: "Medium",
      freq: 70,
      tags: ["String", "DP"],
    },
  ],
  Flipkart: [
    { id: 1, t: "Two Sum", d: "Easy", freq: 92, tags: ["Array", "Hash Table"] },
    {
      id: 2,
      t: "Add Two Numbers",
      d: "Medium",
      freq: 85,
      tags: ["Linked List", "Math"],
    },
    {
      id: 3,
      t: "Longest Substring Without Repeating Characters",
      d: "Medium",
      freq: 80,
      tags: ["Hash Table", "Sliding Window"],
    },
    {
      id: 11,
      t: "Container With Most Water",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Two Pointers", "Greedy"],
    },
    {
      id: 15,
      t: "3Sum",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Two Pointers", "Sorting"],
    },
    {
      id: 20,
      t: "Valid Parentheses",
      d: "Easy",
      freq: 85,
      tags: ["String", "Stack"],
    },
    {
      id: 21,
      t: "Merge Two Sorted Lists",
      d: "Easy",
      freq: 82,
      tags: ["Linked List"],
    },
    {
      id: 22,
      t: "Generate Parentheses",
      d: "Medium",
      freq: 72,
      tags: ["String", "DP", "Backtracking"],
    },
    {
      id: 33,
      t: "Search in Rotated Sorted Array",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Binary Search"],
    },
    {
      id: 39,
      t: "Combination Sum",
      d: "Medium",
      freq: 70,
      tags: ["Array", "Backtracking"],
    },
    {
      id: 42,
      t: "Trapping Rain Water",
      d: "Hard",
      freq: 78,
      tags: ["Array", "Two Pointers", "Stack"],
    },
    {
      id: 46,
      t: "Permutations",
      d: "Medium",
      freq: 70,
      tags: ["Array", "Backtracking"],
    },
    {
      id: 48,
      t: "Rotate Image",
      d: "Medium",
      freq: 72,
      tags: ["Array", "Math", "Matrix"],
    },
    {
      id: 49,
      t: "Group Anagrams",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Hash Table", "String", "Sorting"],
    },
    {
      id: 53,
      t: "Maximum Subarray",
      d: "Medium",
      freq: 85,
      tags: ["Array", "Divide and Conquer", "DP"],
    },
    {
      id: 54,
      t: "Spiral Matrix",
      d: "Medium",
      freq: 72,
      tags: ["Array", "Matrix", "Simulation"],
    },
    {
      id: 56,
      t: "Merge Intervals",
      d: "Medium",
      freq: 82,
      tags: ["Array", "Sorting"],
    },
    {
      id: 62,
      t: "Unique Paths",
      d: "Medium",
      freq: 70,
      tags: ["Math", "DP", "Combinatorics"],
    },
    {
      id: 70,
      t: "Climbing Stairs",
      d: "Easy",
      freq: 78,
      tags: ["Math", "DP", "Memoization"],
    },
    {
      id: 76,
      t: "Minimum Window Substring",
      d: "Hard",
      freq: 68,
      tags: ["String", "Sliding Window"],
    },
    { id: 91, t: "Decode Ways", d: "Medium", freq: 70, tags: ["String", "DP"] },
    {
      id: 98,
      t: "Validate Binary Search Tree",
      d: "Medium",
      freq: 75,
      tags: ["Tree", "DFS", "BST"],
    },
    {
      id: 102,
      t: "Binary Tree Level Order Traversal",
      d: "Medium",
      freq: 78,
      tags: ["Tree", "BFS"],
    },
    {
      id: 104,
      t: "Maximum Depth of Binary Tree",
      d: "Easy",
      freq: 78,
      tags: ["Tree", "DFS", "BFS"],
    },
    {
      id: 121,
      t: "Best Time to Buy and Sell Stock",
      d: "Easy",
      freq: 88,
      tags: ["Array", "DP"],
    },
    {
      id: 128,
      t: "Longest Consecutive Sequence",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Hash Table", "Union Find"],
    },
    {
      id: 139,
      t: "Word Break",
      d: "Medium",
      freq: 75,
      tags: ["Hash Table", "String", "DP", "Trie"],
    },
    {
      id: 141,
      t: "Linked List Cycle",
      d: "Easy",
      freq: 78,
      tags: ["Hash Table", "Linked List", "Two Pointers"],
    },
    {
      id: 146,
      t: "LRU Cache",
      d: "Medium",
      freq: 85,
      tags: ["Hash Table", "Linked List", "Design"],
    },
    {
      id: 152,
      t: "Maximum Product Subarray",
      d: "Medium",
      freq: 72,
      tags: ["Array", "DP"],
    },
    {
      id: 198,
      t: "House Robber",
      d: "Medium",
      freq: 75,
      tags: ["Array", "DP"],
    },
    {
      id: 200,
      t: "Number of Islands",
      d: "Medium",
      freq: 82,
      tags: ["Array", "DFS", "BFS", "Union Find"],
    },
    {
      id: 206,
      t: "Reverse Linked List",
      d: "Easy",
      freq: 82,
      tags: ["Linked List", "Recursion"],
    },
    {
      id: 207,
      t: "Course Schedule",
      d: "Medium",
      freq: 72,
      tags: ["DFS", "BFS", "Graph", "Topological Sort"],
    },
    {
      id: 215,
      t: "Kth Largest Element in an Array",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Divide and Conquer", "Sorting", "Heap", "Quickselect"],
    },
    {
      id: 226,
      t: "Invert Binary Tree",
      d: "Easy",
      freq: 72,
      tags: ["Tree", "DFS", "BFS"],
    },
    {
      id: 235,
      t: "Lowest Common Ancestor of a BST",
      d: "Medium",
      freq: 72,
      tags: ["Tree", "DFS", "BST"],
    },
    {
      id: 236,
      t: "Lowest Common Ancestor of a Binary Tree",
      d: "Medium",
      freq: 78,
      tags: ["Tree", "DFS"],
    },
    {
      id: 238,
      t: "Product of Array Except Self",
      d: "Medium",
      freq: 80,
      tags: ["Array", "Prefix Sum"],
    },
    {
      id: 253,
      t: "Meeting Rooms II",
      d: "Medium",
      freq: 80,
      tags: ["Array", "Sorting", "Heap"],
    },
    {
      id: 283,
      t: "Move Zeroes",
      d: "Easy",
      freq: 78,
      tags: ["Array", "Two Pointers"],
    },
    {
      id: 295,
      t: "Find Median from Data Stream",
      d: "Hard",
      freq: 68,
      tags: ["Sorting", "Heap", "Design"],
    },
    {
      id: 322,
      t: "Coin Change",
      d: "Medium",
      freq: 80,
      tags: ["Array", "DP", "BFS"],
    },
    {
      id: 347,
      t: "Top K Frequent Elements",
      d: "Medium",
      freq: 80,
      tags: ["Array", "Hash Table", "Sorting", "Heap"],
    },
    {
      id: 394,
      t: "Decode String",
      d: "Medium",
      freq: 72,
      tags: ["String", "Stack", "Recursion"],
    },
    {
      id: 438,
      t: "Find All Anagrams in a String",
      d: "Medium",
      freq: 70,
      tags: ["Hash Table", "String", "Sliding Window"],
    },
    {
      id: 543,
      t: "Diameter of Binary Tree",
      d: "Easy",
      freq: 75,
      tags: ["Tree", "DFS"],
    },
    {
      id: 560,
      t: "Subarray Sum Equals K",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Hash Table", "Prefix Sum"],
    },
    {
      id: 572,
      t: "Subtree of Another Tree",
      d: "Easy",
      freq: 72,
      tags: ["Tree", "DFS", "Hash Function"],
    },
    {
      id: 621,
      t: "Task Scheduler",
      d: "Medium",
      freq: 72,
      tags: ["Array", "Hash Table", "Greedy", "Heap"],
    },
    {
      id: 647,
      t: "Palindromic Substrings",
      d: "Medium",
      freq: 70,
      tags: ["String", "DP"],
    },
    {
      id: 695,
      t: "Max Area of Island",
      d: "Medium",
      freq: 72,
      tags: ["Array", "DFS", "BFS", "Union Find", "Matrix"],
    },
    {
      id: 733,
      t: "Flood Fill",
      d: "Easy",
      freq: 72,
      tags: ["Array", "DFS", "BFS", "Matrix"],
    },
    {
      id: 973,
      t: "K Closest Points to Origin",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Math", "Sorting", "Heap", "Geometry"],
    },
    {
      id: 994,
      t: "Rotting Oranges",
      d: "Medium",
      freq: 72,
      tags: ["Array", "BFS", "Matrix"],
    },
    {
      id: 1143,
      t: "Longest Common Subsequence",
      d: "Medium",
      freq: 72,
      tags: ["String", "DP"],
    },
  ],
  Walmart: [
    { id: 1, t: "Two Sum", d: "Easy", freq: 90, tags: ["Array", "Hash Table"] },
    {
      id: 2,
      t: "Add Two Numbers",
      d: "Medium",
      freq: 82,
      tags: ["Linked List", "Math"],
    },
    {
      id: 3,
      t: "Longest Substring Without Repeating Characters",
      d: "Medium",
      freq: 78,
      tags: ["Hash Table", "Sliding Window"],
    },
    {
      id: 11,
      t: "Container With Most Water",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Two Pointers", "Greedy"],
    },
    {
      id: 15,
      t: "3Sum",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Two Pointers", "Sorting"],
    },
    {
      id: 20,
      t: "Valid Parentheses",
      d: "Easy",
      freq: 82,
      tags: ["String", "Stack"],
    },
    {
      id: 21,
      t: "Merge Two Sorted Lists",
      d: "Easy",
      freq: 80,
      tags: ["Linked List"],
    },
    {
      id: 33,
      t: "Search in Rotated Sorted Array",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Binary Search"],
    },
    {
      id: 42,
      t: "Trapping Rain Water",
      d: "Hard",
      freq: 75,
      tags: ["Array", "Two Pointers", "Stack"],
    },
    {
      id: 46,
      t: "Permutations",
      d: "Medium",
      freq: 70,
      tags: ["Array", "Backtracking"],
    },
    {
      id: 49,
      t: "Group Anagrams",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Hash Table", "String", "Sorting"],
    },
    {
      id: 53,
      t: "Maximum Subarray",
      d: "Medium",
      freq: 82,
      tags: ["Array", "Divide and Conquer", "DP"],
    },
    {
      id: 54,
      t: "Spiral Matrix",
      d: "Medium",
      freq: 72,
      tags: ["Array", "Matrix", "Simulation"],
    },
    {
      id: 56,
      t: "Merge Intervals",
      d: "Medium",
      freq: 80,
      tags: ["Array", "Sorting"],
    },
    {
      id: 62,
      t: "Unique Paths",
      d: "Medium",
      freq: 68,
      tags: ["Math", "DP", "Combinatorics"],
    },
    {
      id: 70,
      t: "Climbing Stairs",
      d: "Easy",
      freq: 75,
      tags: ["Math", "DP", "Memoization"],
    },
    {
      id: 98,
      t: "Validate Binary Search Tree",
      d: "Medium",
      freq: 72,
      tags: ["Tree", "DFS", "BST"],
    },
    {
      id: 102,
      t: "Binary Tree Level Order Traversal",
      d: "Medium",
      freq: 75,
      tags: ["Tree", "BFS"],
    },
    {
      id: 104,
      t: "Maximum Depth of Binary Tree",
      d: "Easy",
      freq: 75,
      tags: ["Tree", "DFS", "BFS"],
    },
    {
      id: 121,
      t: "Best Time to Buy and Sell Stock",
      d: "Easy",
      freq: 85,
      tags: ["Array", "DP"],
    },
    {
      id: 128,
      t: "Longest Consecutive Sequence",
      d: "Medium",
      freq: 72,
      tags: ["Array", "Hash Table", "Union Find"],
    },
    {
      id: 139,
      t: "Word Break",
      d: "Medium",
      freq: 72,
      tags: ["Hash Table", "String", "DP", "Trie"],
    },
    {
      id: 141,
      t: "Linked List Cycle",
      d: "Easy",
      freq: 75,
      tags: ["Hash Table", "Linked List", "Two Pointers"],
    },
    {
      id: 146,
      t: "LRU Cache",
      d: "Medium",
      freq: 82,
      tags: ["Hash Table", "Linked List", "Design"],
    },
    {
      id: 152,
      t: "Maximum Product Subarray",
      d: "Medium",
      freq: 70,
      tags: ["Array", "DP"],
    },
    {
      id: 198,
      t: "House Robber",
      d: "Medium",
      freq: 72,
      tags: ["Array", "DP"],
    },
    {
      id: 200,
      t: "Number of Islands",
      d: "Medium",
      freq: 80,
      tags: ["Array", "DFS", "BFS", "Union Find"],
    },
    {
      id: 206,
      t: "Reverse Linked List",
      d: "Easy",
      freq: 80,
      tags: ["Linked List", "Recursion"],
    },
    {
      id: 207,
      t: "Course Schedule",
      d: "Medium",
      freq: 70,
      tags: ["DFS", "BFS", "Graph", "Topological Sort"],
    },
    {
      id: 215,
      t: "Kth Largest Element in an Array",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Divide and Conquer", "Sorting", "Heap", "Quickselect"],
    },
    {
      id: 226,
      t: "Invert Binary Tree",
      d: "Easy",
      freq: 70,
      tags: ["Tree", "DFS", "BFS"],
    },
    {
      id: 236,
      t: "Lowest Common Ancestor of a Binary Tree",
      d: "Medium",
      freq: 72,
      tags: ["Tree", "DFS"],
    },
    {
      id: 238,
      t: "Product of Array Except Self",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Prefix Sum"],
    },
    {
      id: 253,
      t: "Meeting Rooms II",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Sorting", "Heap"],
    },
    {
      id: 283,
      t: "Move Zeroes",
      d: "Easy",
      freq: 75,
      tags: ["Array", "Two Pointers"],
    },
    {
      id: 295,
      t: "Find Median from Data Stream",
      d: "Hard",
      freq: 65,
      tags: ["Sorting", "Heap", "Design"],
    },
    {
      id: 322,
      t: "Coin Change",
      d: "Medium",
      freq: 78,
      tags: ["Array", "DP", "BFS"],
    },
    {
      id: 347,
      t: "Top K Frequent Elements",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Hash Table", "Sorting", "Heap"],
    },
    {
      id: 394,
      t: "Decode String",
      d: "Medium",
      freq: 70,
      tags: ["String", "Stack", "Recursion"],
    },
    {
      id: 438,
      t: "Find All Anagrams in a String",
      d: "Medium",
      freq: 68,
      tags: ["Hash Table", "String", "Sliding Window"],
    },
    {
      id: 543,
      t: "Diameter of Binary Tree",
      d: "Easy",
      freq: 72,
      tags: ["Tree", "DFS"],
    },
    {
      id: 560,
      t: "Subarray Sum Equals K",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Hash Table", "Prefix Sum"],
    },
    {
      id: 572,
      t: "Subtree of Another Tree",
      d: "Easy",
      freq: 68,
      tags: ["Tree", "DFS", "Hash Function"],
    },
    {
      id: 621,
      t: "Task Scheduler",
      d: "Medium",
      freq: 70,
      tags: ["Array", "Hash Table", "Greedy", "Heap"],
    },
    {
      id: 695,
      t: "Max Area of Island",
      d: "Medium",
      freq: 70,
      tags: ["Array", "DFS", "BFS", "Union Find", "Matrix"],
    },
    {
      id: 733,
      t: "Flood Fill",
      d: "Easy",
      freq: 70,
      tags: ["Array", "DFS", "BFS", "Matrix"],
    },
    {
      id: 973,
      t: "K Closest Points to Origin",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Math", "Sorting", "Heap", "Geometry"],
    },
    {
      id: 994,
      t: "Rotting Oranges",
      d: "Medium",
      freq: 70,
      tags: ["Array", "BFS", "Matrix"],
    },
    {
      id: 1143,
      t: "Longest Common Subsequence",
      d: "Medium",
      freq: 70,
      tags: ["String", "DP"],
    },
    {
      id: 1480,
      t: "Running Sum of 1d Array",
      d: "Easy",
      freq: 68,
      tags: ["Array", "Prefix Sum"],
    },
  ],
  Atlassian: [
    { id: 1, t: "Two Sum", d: "Easy", freq: 88, tags: ["Array", "Hash Table"] },
    {
      id: 2,
      t: "Add Two Numbers",
      d: "Medium",
      freq: 80,
      tags: ["Linked List", "Math"],
    },
    {
      id: 3,
      t: "Longest Substring Without Repeating Characters",
      d: "Medium",
      freq: 78,
      tags: ["Hash Table", "Sliding Window"],
    },
    {
      id: 15,
      t: "3Sum",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Two Pointers", "Sorting"],
    },
    {
      id: 20,
      t: "Valid Parentheses",
      d: "Easy",
      freq: 82,
      tags: ["String", "Stack"],
    },
    {
      id: 21,
      t: "Merge Two Sorted Lists",
      d: "Easy",
      freq: 78,
      tags: ["Linked List"],
    },
    {
      id: 22,
      t: "Generate Parentheses",
      d: "Medium",
      freq: 72,
      tags: ["String", "DP", "Backtracking"],
    },
    {
      id: 33,
      t: "Search in Rotated Sorted Array",
      d: "Medium",
      freq: 72,
      tags: ["Array", "Binary Search"],
    },
    {
      id: 42,
      t: "Trapping Rain Water",
      d: "Hard",
      freq: 72,
      tags: ["Array", "Two Pointers", "Stack"],
    },
    {
      id: 46,
      t: "Permutations",
      d: "Medium",
      freq: 68,
      tags: ["Array", "Backtracking"],
    },
    {
      id: 49,
      t: "Group Anagrams",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Hash Table", "String", "Sorting"],
    },
    {
      id: 53,
      t: "Maximum Subarray",
      d: "Medium",
      freq: 80,
      tags: ["Array", "Divide and Conquer", "DP"],
    },
    {
      id: 56,
      t: "Merge Intervals",
      d: "Medium",
      freq: 80,
      tags: ["Array", "Sorting"],
    },
    {
      id: 70,
      t: "Climbing Stairs",
      d: "Easy",
      freq: 72,
      tags: ["Math", "DP", "Memoization"],
    },
    {
      id: 76,
      t: "Minimum Window Substring",
      d: "Hard",
      freq: 65,
      tags: ["String", "Sliding Window"],
    },
    { id: 91, t: "Decode Ways", d: "Medium", freq: 68, tags: ["String", "DP"] },
    {
      id: 98,
      t: "Validate Binary Search Tree",
      d: "Medium",
      freq: 72,
      tags: ["Tree", "DFS", "BST"],
    },
    {
      id: 102,
      t: "Binary Tree Level Order Traversal",
      d: "Medium",
      freq: 75,
      tags: ["Tree", "BFS"],
    },
    {
      id: 104,
      t: "Maximum Depth of Binary Tree",
      d: "Easy",
      freq: 75,
      tags: ["Tree", "DFS", "BFS"],
    },
    {
      id: 121,
      t: "Best Time to Buy and Sell Stock",
      d: "Easy",
      freq: 82,
      tags: ["Array", "DP"],
    },
    {
      id: 128,
      t: "Longest Consecutive Sequence",
      d: "Medium",
      freq: 72,
      tags: ["Array", "Hash Table", "Union Find"],
    },
    {
      id: 139,
      t: "Word Break",
      d: "Medium",
      freq: 72,
      tags: ["Hash Table", "String", "DP", "Trie"],
    },
    {
      id: 146,
      t: "LRU Cache",
      d: "Medium",
      freq: 82,
      tags: ["Hash Table", "Linked List", "Design"],
    },
    {
      id: 198,
      t: "House Robber",
      d: "Medium",
      freq: 70,
      tags: ["Array", "DP"],
    },
    {
      id: 200,
      t: "Number of Islands",
      d: "Medium",
      freq: 80,
      tags: ["Array", "DFS", "BFS", "Union Find"],
    },
    {
      id: 206,
      t: "Reverse Linked List",
      d: "Easy",
      freq: 80,
      tags: ["Linked List", "Recursion"],
    },
    {
      id: 207,
      t: "Course Schedule",
      d: "Medium",
      freq: 70,
      tags: ["DFS", "BFS", "Graph", "Topological Sort"],
    },
    {
      id: 215,
      t: "Kth Largest Element in an Array",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Divide and Conquer", "Sorting", "Heap", "Quickselect"],
    },
    {
      id: 226,
      t: "Invert Binary Tree",
      d: "Easy",
      freq: 70,
      tags: ["Tree", "DFS", "BFS"],
    },
    {
      id: 236,
      t: "Lowest Common Ancestor of a Binary Tree",
      d: "Medium",
      freq: 72,
      tags: ["Tree", "DFS"],
    },
    {
      id: 238,
      t: "Product of Array Except Self",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Prefix Sum"],
    },
    {
      id: 253,
      t: "Meeting Rooms II",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Sorting", "Heap"],
    },
    {
      id: 283,
      t: "Move Zeroes",
      d: "Easy",
      freq: 72,
      tags: ["Array", "Two Pointers"],
    },
    {
      id: 295,
      t: "Find Median from Data Stream",
      d: "Hard",
      freq: 62,
      tags: ["Sorting", "Heap", "Design"],
    },
    {
      id: 322,
      t: "Coin Change",
      d: "Medium",
      freq: 78,
      tags: ["Array", "DP", "BFS"],
    },
    {
      id: 347,
      t: "Top K Frequent Elements",
      d: "Medium",
      freq: 78,
      tags: ["Array", "Hash Table", "Sorting", "Heap"],
    },
    {
      id: 380,
      t: "Insert Delete GetRandom O(1)",
      d: "Medium",
      freq: 72,
      tags: ["Array", "Hash Table", "Math", "Design"],
    },
    {
      id: 394,
      t: "Decode String",
      d: "Medium",
      freq: 75,
      tags: ["String", "Stack", "Recursion"],
    },
    {
      id: 438,
      t: "Find All Anagrams in a String",
      d: "Medium",
      freq: 70,
      tags: ["Hash Table", "String", "Sliding Window"],
    },
    {
      id: 543,
      t: "Diameter of Binary Tree",
      d: "Easy",
      freq: 72,
      tags: ["Tree", "DFS"],
    },
    {
      id: 560,
      t: "Subarray Sum Equals K",
      d: "Medium",
      freq: 75,
      tags: ["Array", "Hash Table", "Prefix Sum"],
    },
    {
      id: 572,
      t: "Subtree of Another Tree",
      d: "Easy",
      freq: 68,
      tags: ["Tree", "DFS", "Hash Function"],
    },
    {
      id: 621,
      t: "Task Scheduler",
      d: "Medium",
      freq: 72,
      tags: ["Array", "Hash Table", "Greedy", "Heap"],
    },
    {
      id: 647,
      t: "Palindromic Substrings",
      d: "Medium",
      freq: 68,
      tags: ["String", "DP"],
    },
    {
      id: 695,
      t: "Max Area of Island",
      d: "Medium",
      freq: 70,
      tags: ["Array", "DFS", "BFS", "Union Find", "Matrix"],
    },
    {
      id: 733,
      t: "Flood Fill",
      d: "Easy",
      freq: 68,
      tags: ["Array", "DFS", "BFS", "Matrix"],
    },
    {
      id: 973,
      t: "K Closest Points to Origin",
      d: "Medium",
      freq: 72,
      tags: ["Array", "Math", "Sorting", "Heap", "Geometry"],
    },
    {
      id: 994,
      t: "Rotting Oranges",
      d: "Medium",
      freq: 70,
      tags: ["Array", "BFS", "Matrix"],
    },
    {
      id: 1143,
      t: "Longest Common Subsequence",
      d: "Medium",
      freq: 70,
      tags: ["String", "DP"],
    },
    {
      id: 1268,
      t: "Search Suggestions System",
      d: "Medium",
      freq: 68,
      tags: ["Array", "String", "Binary Search", "Trie", "Sorting"],
    },
    {
      id: 1480,
      t: "Running Sum of 1d Array",
      d: "Easy",
      freq: 65,
      tags: ["Array", "Prefix Sum"],
    },
  ],
  Bloomberg: [
    { id: 1, t: "Two Sum", d: "Easy", freq: 58, tags: [] },
    { id: 2, t: "Add Two Numbers", d: "Medium", freq: 49, tags: [] },
    { id: 3, t: "Longest Substring Without Repeating Characters", d: "Medium", freq: 39, tags: [] },
    { id: 4, t: "Median of Two Sorted Arrays", d: "Hard", freq: 47, tags: [] },
    { id: 5, t: "Longest Palindromic Substring", d: "Medium", freq: 38, tags: [] },
    { id: 7, t: "Reverse Integer", d: "Medium", freq: 32, tags: [] },
    { id: 8, t: "String to Integer (atoi)", d: "Medium", freq: 21, tags: [] },
    { id: 9, t: "Palindrome Number", d: "Easy", freq: 61, tags: [] },
    { id: 11, t: "Container With Most Water", d: "Medium", freq: 60, tags: [] },
    { id: 13, t: "Roman to Integer", d: "Easy", freq: 67, tags: [] },
    { id: 14, t: "Longest Common Prefix", d: "Easy", freq: 48, tags: [] },
    { id: 15, t: "3Sum", d: "Medium", freq: 39, tags: [] },
    { id: 17, t: "Letter Combinations of a Phone Number", d: "Medium", freq: 66, tags: [] },
    { id: 18, t: "4Sum", d: "Medium", freq: 41, tags: [] },
    { id: 20, t: "Valid Parentheses", d: "Easy", freq: 44, tags: [] },
    { id: 21, t: "Merge Two Sorted Lists", d: "Easy", freq: 68, tags: [] },
    { id: 22, t: "Generate Parentheses", d: "Medium", freq: 79, tags: [] },
    { id: 26, t: "Remove Duplicates from Sorted Array", d: "Easy", freq: 63, tags: [] },
    { id: 28, t: "Find the Index of the First Occurrence in a String", d: "Easy", freq: 47, tags: [] },
    { id: 30, t: "Substring with Concatenation of All Words", d: "Hard", freq: 35, tags: [] },
    { id: 31, t: "Next Permutation", d: "Medium", freq: 45, tags: [] },
    { id: 33, t: "Search in Rotated Sorted Array", d: "Medium", freq: 45, tags: [] },
    { id: 34, t: "Find First and Last Position of Element in Sorted Array", d: "Medium", freq: 49, tags: [] },
    { id: 35, t: "Search Insert Position", d: "Easy", freq: 51, tags: [] },
    { id: 36, t: "Valid Sudoku", d: "Medium", freq: 65, tags: [] },
    { id: 40, t: "Combination Sum II", d: "Medium", freq: 60, tags: [] },
    { id: 42, t: "Trapping Rain Water", d: "Hard", freq: 68, tags: [] },
    { id: 45, t: "Jump Game II", d: "Medium", freq: 43, tags: [] },
    { id: 46, t: "Permutations", d: "Medium", freq: 82, tags: [] },
    { id: 48, t: "Rotate Image", d: "Medium", freq: 80, tags: [] },
    { id: 49, t: "Group Anagrams", d: "Medium", freq: 73, tags: [] },
    { id: 50, t: "Pow(x, n)", d: "Medium", freq: 39, tags: [] },
    { id: 53, t: "Maximum Subarray", d: "Medium", freq: 53, tags: [] },
    { id: 56, t: "Merge Intervals", d: "Medium", freq: 52, tags: [] },
    { id: 57, t: "Insert Interval", d: "Medium", freq: 78, tags: [] },
    { id: 61, t: "Rotate List", d: "Medium", freq: 43, tags: [] },
    { id: 66, t: "Plus One", d: "Easy", freq: 50, tags: [] },
    { id: 69, t: "Sqrt(x)", d: "Easy", freq: 42, tags: [] },
    { id: 70, t: "Climbing Stairs", d: "Easy", freq: 54, tags: [] },
    { id: 73, t: "Set Matrix Zeroes", d: "Medium", freq: 63, tags: [] },
    { id: 74, t: "Search a 2D Matrix", d: "Medium", freq: 54, tags: [] },
    { id: 75, t: "Sort Colors", d: "Medium", freq: 70, tags: [] },
    { id: 77, t: "Combinations", d: "Medium", freq: 75, tags: [] },
    { id: 78, t: "Subsets", d: "Medium", freq: 82, tags: [] },
    { id: 79, t: "Word Search", d: "Medium", freq: 48, tags: [] },
    { id: 83, t: "Remove Duplicates from Sorted List", d: "Easy", freq: 57, tags: [] },
    { id: 84, t: "Largest Rectangle in Histogram", d: "Hard", freq: 50, tags: [] },
    { id: 86, t: "Partition List", d: "Medium", freq: 61, tags: [] },
    { id: 88, t: "Merge Sorted Array", d: "Easy", freq: 55, tags: [] },
    { id: 101, t: "Symmetric Tree", d: "Easy", freq: 61, tags: [] },
    { id: 118, t: "Pascal's Triangle", d: "Easy", freq: 79, tags: [] },
    { id: 121, t: "Best Time to Buy and Sell Stock", d: "Easy", freq: 57, tags: [] },
    { id: 125, t: "Valid Palindrome", d: "Easy", freq: 53, tags: [] },
    { id: 127, t: "Word Ladder", d: "Hard", freq: 46, tags: [] },
    { id: 128, t: "Longest Consecutive Sequence", d: "Medium", freq: 47, tags: [] },
    { id: 130, t: "Surrounded Regions", d: "Medium", freq: 45, tags: [] },
    { id: 134, t: "Gas Station", d: "Medium", freq: 48, tags: [] },
    { id: 135, t: "Candy", d: "Hard", freq: 49, tags: [] },
    { id: 136, t: "Single Number", d: "Easy", freq: 78, tags: [] },
    { id: 139, t: "Word Break", d: "Medium", freq: 50, tags: [] },
    { id: 140, t: "Word Break II", d: "Hard", freq: 56, tags: [] },
    { id: 143, t: "Reorder List", d: "Medium", freq: 65, tags: [] },
    { id: 146, t: "LRU Cache", d: "Medium", freq: 48, tags: [] },
    { id: 150, t: "Evaluate Reverse Polish Notation", d: "Medium", freq: 58, tags: [] },
    { id: 153, t: "Find Minimum in Rotated Sorted Array", d: "Medium", freq: 55, tags: [] },
    { id: 155, t: "Min Stack", d: "Medium", freq: 58, tags: [] },
    { id: 162, t: "Find Peak Element", d: "Medium", freq: 47, tags: [] },
    { id: 167, t: "Two Sum II - Input Array Is Sorted", d: "Medium", freq: 65, tags: [] },
    { id: 169, t: "Majority Element", d: "Easy", freq: 66, tags: [] },
    { id: 176, t: "Second Highest Salary", d: "Medium", freq: 47, tags: [] },
    { id: 181, t: "Employees Earning More Than Their Managers", d: "Easy", freq: 73, tags: [] },
    { id: 182, t: "Duplicate Emails", d: "Easy", freq: 74, tags: [] },
    { id: 189, t: "Rotate Array", d: "Medium", freq: 45, tags: [] },
    { id: 197, t: "Rising Temperature", d: "Easy", freq: 51, tags: [] },
    { id: 198, t: "House Robber", d: "Medium", freq: 53, tags: [] },
    { id: 200, t: "Number of Islands", d: "Medium", freq: 65, tags: [] },
    { id: 206, t: "Reverse Linked List", d: "Easy", freq: 81, tags: [] },
    { id: 210, t: "Course Schedule II", d: "Medium", freq: 56, tags: [] },
    { id: 217, t: "Contains Duplicate", d: "Easy", freq: 64, tags: [] },
    { id: 219, t: "Contains Duplicate II", d: "Easy", freq: 51, tags: [] },
    { id: 224, t: "Basic Calculator", d: "Hard", freq: 47, tags: [] },
    { id: 228, t: "Summary Ranges", d: "Easy", freq: 54, tags: [] },
    { id: 229, t: "Majority Element II", d: "Medium", freq: 56, tags: [] },
    { id: 231, t: "Power of Two", d: "Easy", freq: 50, tags: [] },
    { id: 236, t: "Lowest Common Ancestor of a Binary Tree", d: "Medium", freq: 69, tags: [] },
    { id: 238, t: "Product of Array Except Self", d: "Medium", freq: 69, tags: [] },
    { id: 239, t: "Sliding Window Maximum", d: "Hard", freq: 49, tags: [] },
    { id: 242, t: "Valid Anagram", d: "Easy", freq: 68, tags: [] },
    { id: 253, t: "Meeting Rooms II", d: "Medium", freq: 53, tags: [] },
    { id: 268, t: "Missing Number", d: "Easy", freq: 72, tags: [] },
    { id: 279, t: "Perfect Squares", d: "Medium", freq: 57, tags: [] },
    { id: 283, t: "Move Zeroes", d: "Easy", freq: 64, tags: [] },
    { id: 300, t: "Longest Increasing Subsequence", d: "Medium", freq: 60, tags: [] },
    { id: 322, t: "Coin Change", d: "Medium", freq: 49, tags: [] },
    { id: 326, t: "Power of Three", d: "Easy", freq: 51, tags: [] },
    { id: 332, t: "Reconstruct Itinerary", d: "Hard", freq: 45, tags: [] },
    { id: 344, t: "Reverse String", d: "Easy", freq: 81, tags: [] },
    { id: 347, t: "Top K Frequent Elements", d: "Medium", freq: 67, tags: [] },
    { id: 349, t: "Intersection of Two Arrays", d: "Easy", freq: 78, tags: [] },
    { id: 368, t: "Largest Divisible Subset", d: "Medium", freq: 50, tags: [] },
    { id: 380, t: "Insert Delete GetRandom O(1)", d: "Medium", freq: 55, tags: [] },
    { id: 387, t: "First Unique Character in a String", d: "Easy", freq: 66, tags: [] },
    { id: 394, t: "Decode String", d: "Medium", freq: 63, tags: [] },
    { id: 399, t: "Evaluate Division", d: "Medium", freq: 64, tags: [] },
    { id: 410, t: "Split Array Largest Sum", d: "Hard", freq: 61, tags: [] },
    { id: 412, t: "Fizz Buzz", d: "Easy", freq: 76, tags: [] },
    { id: 424, t: "Longest Repeating Character Replacement", d: "Medium", freq: 60, tags: [] },
    { id: 430, t: "Flatten a Multilevel Doubly Linked List", d: "Medium", freq: 63, tags: [] },
    { id: 451, t: "Sort Characters By Frequency", d: "Medium", freq: 75, tags: [] },
    { id: 485, t: "Max Consecutive Ones", d: "Easy", freq: 65, tags: [] },
    { id: 493, t: "Reverse Pairs", d: "Hard", freq: 34, tags: [] },
    { id: 496, t: "Next Greater Element I", d: "Easy", freq: 76, tags: [] },
    { id: 503, t: "Next Greater Element II", d: "Medium", freq: 69, tags: [] },
    { id: 525, t: "Contiguous Array", d: "Medium", freq: 52, tags: [] },
    { id: 543, t: "Diameter of Binary Tree", d: "Easy", freq: 66, tags: [] },
    { id: 547, t: "Number of Provinces", d: "Medium", freq: 71, tags: [] },
    { id: 560, t: "Subarray Sum Equals K", d: "Medium", freq: 47, tags: [] },
    { id: 584, t: "Find Customer Referee", d: "Easy", freq: 73, tags: [] },
    { id: 595, t: "Big Countries", d: "Easy", freq: 69, tags: [] },
    { id: 598, t: "Range Addition II", d: "Easy", freq: 59, tags: [] },
    { id: 611, t: "Valid Triangle Number", d: "Medium", freq: 57, tags: [] },
    { id: 645, t: "Set Mismatch", d: "Easy", freq: 44, tags: [] },
    { id: 704, t: "Binary Search", d: "Easy", freq: 61, tags: [] },
    { id: 721, t: "Accounts Merge", d: "Medium", freq: 61, tags: [] },
    { id: 735, t: "Asteroid Collision", d: "Medium", freq: 48, tags: [] },
    { id: 739, t: "Daily Temperatures", d: "Medium", freq: 69, tags: [] },
    { id: 796, t: "Rotate String", d: "Easy", freq: 67, tags: [] },
    { id: 797, t: "All Paths From Source to Target", d: "Medium", freq: 84, tags: [] },
    { id: 875, t: "Koko Eating Bananas", d: "Medium", freq: 50, tags: [] },
    { id: 904, t: "Fruit Into Baskets", d: "Medium", freq: 51, tags: [] },
    { id: 912, t: "Sort an Array", d: "Medium", freq: 56, tags: [] },
    { id: 930, t: "Binary Subarrays With Sum", d: "Medium", freq: 69, tags: [] },
    { id: 933, t: "Number of Recent Calls", d: "Easy", freq: 79, tags: [] },
    { id: 941, t: "Valid Mountain Array", d: "Easy", freq: 35, tags: [] },
    { id: 977, t: "Squares of a Sorted Array", d: "Easy", freq: 74, tags: [] },
    { id: 994, t: "Rotting Oranges", d: "Medium", freq: 59, tags: [] },
    { id: 1011, t: "Capacity To Ship Packages Within D Days", d: "Medium", freq: 74, tags: [] },
    { id: 1029, t: "Two City Scheduling", d: "Medium", freq: 69, tags: [] },
    { id: 1169, t: "Invalid Transactions", d: "Medium", freq: 32, tags: [] },
    { id: 1235, t: "Maximum Profit in Job Scheduling", d: "Hard", freq: 55, tags: [] },
    { id: 1268, t: "Search Suggestions System", d: "Medium", freq: 65, tags: [] },
    { id: 1274, t: "Number of Ships in a Rectangle", d: "Hard", freq: 69, tags: [] },
    { id: 1295, t: "Find Numbers with Even Number of Digits", d: "Easy", freq: 80, tags: [] },
    { id: 134, t: "Gas Station", d: "Medium", freq: 48, tags: [] },
    { id: 1387, t: "Sort Integers by The Power Value", d: "Medium", freq: 72, tags: [] },
    { id: 1396, t: "Design Underground System", d: "Medium", freq: 75, tags: [] },
    { id: 1502, t: "Can Make Arithmetic Progression From Sequence", d: "Easy", freq: 69, tags: [] },
    { id: 1583, t: "Count Unhappy Friends", d: "Medium", freq: 63, tags: [] },
    { id: 1722, t: "Minimize Hamming Distance After Swap Operations", d: "Medium", freq: 70, tags: [] },
    { id: 1727, t: "Largest Submatrix With Rearrangements", d: "Medium", freq: 80, tags: [] },
    { id: 1752, t: "Check if Array Is Sorted and Rotated", d: "Easy", freq: 57, tags: [] },
    { id: 1757, t: "Recyclable and Low Fat Products", d: "Easy", freq: 89, tags: [] },
    { id: 1848, t: "Minimum Distance to the Target Element", d: "Easy", freq: 65, tags: [] },
    { id: 1871, t: "Jump Game VII", d: "Medium", freq: 36, tags: [] },
    { id: 1929, t: "Concatenation of Array", d: "Easy", freq: 90, tags: [] },
    { id: 2144, t: "Minimum Cost of Buying Candies With Discount", d: "Easy", freq: 72, tags: [] },
    { id: 2196, t: "Create Binary Tree From Descriptions", d: "Medium", freq: 84, tags: [] },
    { id: 2657, t: "Find the Prefix Common Array of Two Arrays", d: "Medium", freq: 88, tags: [] },
    { id: 2667, t: "Create Hello World Function", d: "Easy", freq: 82, tags: [] },
    { id: 2833, t: "Furthest Point From Origin", d: "Easy", freq: 77, tags: [] },
    { id: 3488, t: "Closest Equal Element Queries", d: "Medium", freq: 51, tags: [] },
    { id: 3633, t: "Earliest Finish Time for Land and Water Rides I", d: "Easy", freq: 73, tags: [] },
    { id: 3753, t: "Total Waviness of Numbers in Range II", d: "Hard", freq: 57, tags: [] },
  ],
  TikTok: [
    { id: 200, t: "Number of Islands", d: "Medium", freq: 65, tags: [] },
    { id: 146, t: "LRU Cache", d: "Medium", freq: 48, tags: [] },
    { id: 300, t: "Longest Increasing Subsequence", d: "Medium", freq: 60, tags: [] },
    { id: 210, t: "Course Schedule II", d: "Medium", freq: 56, tags: [] },
    { id: 3, t: "Longest Substring Without Repeating Characters", d: "Medium", freq: 39, tags: [] },
    { id: 694, t: "Number of Distinct Islands", d: "Medium", freq: 63, tags: [] },
    { id: 56, t: "Merge Intervals", d: "Medium", freq: 52, tags: [] },
    { id: 253, t: "Meeting Rooms II", d: "Medium", freq: 53, tags: [] },
    { id: 42, t: "Trapping Rain Water", d: "Hard", freq: 68, tags: [] },
    { id: 2334, t: "Subarray With Elements Greater Than Varying Threshold", d: "Hard", freq: 46, tags: [] },
    { id: 207, t: "Course Schedule", d: "Medium", freq: 52, tags: [] },
    { id: 394, t: "Decode String", d: "Medium", freq: 63, tags: [] },
    { id: 5, t: "Longest Palindromic Substring", d: "Medium", freq: 38, tags: [] },
    { id: 68, t: "Text Justification", d: "Hard", freq: 51, tags: [] },
    { id: 79, t: "Word Search", d: "Medium", freq: 48, tags: [] },
    { id: 51, t: "N-Queens", d: "Hard", freq: 76, tags: [] },
    { id: 76, t: "Minimum Window Substring", d: "Hard", freq: 48, tags: [] },
    { id: 15, t: "3Sum", d: "Medium", freq: 39, tags: [] },
    { id: 33, t: "Search in Rotated Sorted Array", d: "Medium", freq: 45, tags: [] },
    { id: 1151, t: "Minimum Swaps to Group All 1's Together", d: "Medium", freq: 61, tags: [] },
    { id: 69, t: "Sqrt(x)", d: "Easy", freq: 42, tags: [] },
    { id: 322, t: "Coin Change", d: "Medium", freq: 49, tags: [] },
    { id: 347, t: "Top K Frequent Elements", d: "Medium", freq: 67, tags: [] },
    { id: 560, t: "Subarray Sum Equals K", d: "Medium", freq: 47, tags: [] },
    { id: 23, t: "Merge k Sorted Lists", d: "Hard", freq: 60, tags: [] },
    { id: 1802, t: "Maximum Value at a Given Index in a Bounded Array", d: "Medium", freq: 39, tags: [] },
    { id: 54, t: "Spiral Matrix", d: "Medium", freq: 57, tags: [] },
    { id: 121, t: "Best Time to Buy and Sell Stock", d: "Easy", freq: 57, tags: [] },
    { id: 198, t: "House Robber", d: "Medium", freq: 53, tags: [] },
    { id: 227, t: "Basic Calculator II", d: "Medium", freq: 47, tags: [] },
    { id: 670, t: "Maximum Swap", d: "Medium", freq: 52, tags: [] },
    { id: 827, t: "Making A Large Island", d: "Hard", freq: 57, tags: [] },
    { id: 1405, t: "Longest Happy String", d: "Medium", freq: 66, tags: [] },
    { id: 1, t: "Two Sum", d: "Easy", freq: 58, tags: [] },
    { id: 128, t: "Longest Consecutive Sequence", d: "Medium", freq: 47, tags: [] },
    { id: 772, t: "Basic Calculator III", d: "Hard", freq: 53, tags: [] },
    { id: 1146, t: "Snapshot Array", d: "Medium", freq: 37, tags: [] },
    { id: 20, t: "Valid Parentheses", d: "Easy", freq: 44, tags: [] },
    { id: 22, t: "Generate Parentheses", d: "Medium", freq: 79, tags: [] },
    { id: 127, t: "Word Ladder", d: "Hard", freq: 46, tags: [] },
    { id: 215, t: "Kth Largest Element in an Array", d: "Medium", freq: 69, tags: [] },
    { id: 380, t: "Insert Delete GetRandom O(1)", d: "Medium", freq: 55, tags: [] },
    { id: 75, t: "Sort Colors", d: "Medium", freq: 70, tags: [] },
    { id: 212, t: "Word Search II", d: "Hard", freq: 39, tags: [] },
    { id: 329, t: "Longest Increasing Path in a Matrix", d: "Hard", freq: 57, tags: [] },
    { id: 678, t: "Valid Parenthesis String", d: "Medium", freq: 40, tags: [] },
    { id: 695, t: "Max Area of Island", d: "Medium", freq: 74, tags: [] },
    { id: 706, t: "Design HashMap", d: "Easy", freq: 67, tags: [] },
    { id: 739, t: "Daily Temperatures", d: "Medium", freq: 69, tags: [] },
    { id: 2402, t: "Meeting Rooms III", d: "Hard", freq: 52, tags: [] },
    { id: 72, t: "Edit Distance", d: "Medium", freq: 61, tags: [] },
    { id: 105, t: "Construct Binary Tree from Preorder and Inorder Traversal", d: "Medium", freq: 69, tags: [] },
    { id: 140, t: "Word Break II", d: "Hard", freq: 56, tags: [] },
    { id: 3389, t: "Minimum Operations to Make Character Frequencies Equal", d: "Hard", freq: 27, tags: [] },
    { id: 3441, t: "Minimum Cost Good Caption", d: "Hard", freq: 21, tags: [] },
    { id: 3474, t: "Lexicographically Smallest Generated String", d: "Hard", freq: 54, tags: [] },
    { id: 39, t: "Combination Sum", d: "Medium", freq: 77, tags: [] },
    { id: 71, t: "Simplify Path", d: "Medium", freq: 51, tags: [] },
    { id: 199, t: "Binary Tree Right Side View", d: "Medium", freq: 70, tags: [] },
    { id: 415, t: "Add Strings", d: "Easy", freq: 52, tags: [] },
    { id: 815, t: "Bus Routes", d: "Hard", freq: 47, tags: [] },
    { id: 1293, t: "Shortest Path in a Grid with Obstacles Elimination", d: "Hard", freq: 46, tags: [] },
    { id: 11, t: "Container With Most Water", d: "Medium", freq: 60, tags: [] },
    { id: 49, t: "Group Anagrams", d: "Medium", freq: 73, tags: [] },
    { id: 70, t: "Climbing Stairs", d: "Easy", freq: 54, tags: [] },
    { id: 124, t: "Binary Tree Maximum Path Sum", d: "Hard", freq: 42, tags: [] },
    { id: 143, t: "Reorder List", d: "Medium", freq: 65, tags: [] },
    { id: 206, t: "Reverse Linked List", d: "Easy", freq: 81, tags: [] },
    { id: 211, t: "Design Add and Search Words Data Structure", d: "Medium", freq: 49, tags: [] },
    { id: 236, t: "Lowest Common Ancestor of a Binary Tree", d: "Medium", freq: 69, tags: [] },
    { id: 295, t: "Find Median from Data Stream", d: "Hard", freq: 55, tags: [] },
    { id: 297, t: "Serialize and Deserialize Binary Tree", d: "Hard", freq: 61, tags: [] },
    { id: 395, t: "Longest Substring with At Least K Repeating Characters", d: "Medium", freq: 46, tags: [] },
    { id: 417, t: "Pacific Atlantic Water Flow", d: "Medium", freq: 61, tags: [] },
    { id: 735, t: "Asteroid Collision", d: "Medium", freq: 48, tags: [] },
    { id: 875, t: "Koko Eating Bananas", d: "Medium", freq: 50, tags: [] },
    { id: 934, t: "Shortest Bridge", d: "Medium", freq: 60, tags: [] },
    { id: 1011, t: "Capacity To Ship Packages Within D Days", d: "Medium", freq: 74, tags: [] },
    { id: 10, t: "Regular Expression Matching", d: "Hard", freq: 31, tags: [] },
    { id: 14, t: "Longest Common Prefix", d: "Easy", freq: 48, tags: [] },
    { id: 25, t: "Reverse Nodes in k-Group", d: "Hard", freq: 66, tags: [] },
    { id: 53, t: "Maximum Subarray", d: "Medium", freq: 53, tags: [] },
    { id: 139, t: "Word Break", d: "Medium", freq: 50, tags: [] },
    { id: 162, t: "Find Peak Element", d: "Medium", freq: 47, tags: [] },
    { id: 224, t: "Basic Calculator", d: "Hard", freq: 47, tags: [] },
    { id: 252, t: "Meeting Rooms", d: "Easy", freq: 60, tags: [] },
    { id: 269, t: "Alien Dictionary", d: "Hard", freq: 37, tags: [] },
    { id: 316, t: "Remove Duplicate Letters", d: "Medium", freq: 53, tags: [] },
    { id: 399, t: "Evaluate Division", d: "Medium", freq: 64, tags: [] },
    { id: 416, t: "Partition Equal Subset Sum", d: "Medium", freq: 50, tags: [] },
    { id: 528, t: "Random Pick with Weight", d: "Medium", freq: 49, tags: [] },
    { id: 994, t: "Rotting Oranges", d: "Medium", freq: 59, tags: [] },
    { id: 1071, t: "Greatest Common Divisor of Strings", d: "Easy", freq: 54, tags: [] },
    { id: 34, t: "Find First and Last Position of Element in Sorted Array", d: "Medium", freq: 49, tags: [] },
    { id: 45, t: "Jump Game II", d: "Medium", freq: 43, tags: [] },
    { id: 46, t: "Permutations", d: "Medium", freq: 82, tags: [] },
    { id: 47, t: "Permutations II", d: "Medium", freq: 64, tags: [] },
    { id: 55, t: "Jump Game", d: "Medium", freq: 41, tags: [] },
    { id: 93, t: "Restore IP Addresses", d: "Medium", freq: 56, tags: [] },
    { id: 122, t: "Best Time to Buy and Sell Stock II", d: "Medium", freq: 71, tags: [] },
    { id: 153, t: "Find Minimum in Rotated Sorted Array", d: "Medium", freq: 55, tags: [] },
    { id: 209, t: "Minimum Size Subarray Sum", d: "Medium", freq: 52, tags: [] },
    { id: 239, t: "Sliding Window Maximum", d: "Hard", freq: 49, tags: [] },
    { id: 283, t: "Move Zeroes", d: "Easy", freq: 64, tags: [] },
    { id: 286, t: "Walls and Gates", d: "Medium", freq: 64, tags: [] },
    { id: 365, t: "Water and Jug Problem", d: "Medium", freq: 46, tags: [] },
    { id: 473, t: "Matchsticks to Square", d: "Medium", freq: 42, tags: [] },
    { id: 588, t: "Design In-Memory File System", d: "Hard", freq: 48, tags: [] },
    { id: 767, t: "Reorganize String", d: "Medium", freq: 57, tags: [] },
    { id: 974, t: "Subarray Sums Divisible by K", d: "Medium", freq: 56, tags: [] },
    { id: 1249, t: "Minimum Remove to Make Valid Parentheses", d: "Medium", freq: 72, tags: [] },
    { id: 1530, t: "Number of Good Leaf Nodes Pairs", d: "Medium", freq: 72, tags: [] },
    { id: 1539, t: "Kth Missing Positive Number", d: "Easy", freq: 64, tags: [] },
    { id: 2021, t: "Brightest Position on Street", d: "Medium", freq: 61, tags: [] },
    { id: 3043, t: "Find the Length of the Longest Common Prefix", d: "Medium", freq: 62, tags: [] },
    { id: 64, t: "Minimum Path Sum", d: "Medium", freq: 68, tags: [] },
    { id: 77, t: "Combinations", d: "Medium", freq: 75, tags: [] },
    { id: 78, t: "Subsets", d: "Medium", freq: 82, tags: [] },
    { id: 165, t: "Compare Version Numbers", d: "Medium", freq: 47, tags: [] },
    { id: 213, t: "House Robber II", d: "Medium", freq: 45, tags: [] },
    { id: 403, t: "Frog Jump", d: "Hard", freq: 47, tags: [] },
    { id: 426, t: "Convert Binary Search Tree to Sorted Doubly Linked List", d: "Medium", freq: 66, tags: [] },
    { id: 442, t: "Find All Duplicates in an Array", d: "Medium", freq: 77, tags: [] },
    { id: 752, t: "Open the Lock", d: "Medium", freq: 61, tags: [] },
    { id: 856, t: "Score of Parentheses", d: "Medium", freq: 64, tags: [] },
    { id: 886, t: "Possible Bipartition", d: "Medium", freq: 53, tags: [] },
    { id: 887, t: "Super Egg Drop", d: "Hard", freq: 30, tags: [] },
    { id: 902, t: "Numbers At Most N Given Digit Set", d: "Hard", freq: 45, tags: [] },
    { id: 907, t: "Sum of Subarray Minimums", d: "Medium", freq: 39, tags: [] },
    { id: 924, t: "Minimize Malware Spread", d: "Hard", freq: 43, tags: [] },
    { id: 1209, t: "Remove All Adjacent Duplicates in String II", d: "Medium", freq: 61, tags: [] },
    { id: 1462, t: "Course Schedule IV", d: "Medium", freq: 60, tags: [] },
    { id: 1466, t: "Reorder Routes to Make All Paths Lead to the City Zero", d: "Medium", freq: 66, tags: [] },
    { id: 1584, t: "Min Cost to Connect All Points", d: "Medium", freq: 71, tags: [] },
    { id: 2468, t: "Split Message Based on Limit", d: "Hard", freq: 42, tags: [] },
    { id: 2850, t: "Minimum Moves to Spread Stones Over Grid", d: "Medium", freq: 46, tags: [] },
    { id: 3071, t: "Minimum Operations to Write the Letter Y on a Grid", d: "Medium", freq: 65, tags: [] },
    { id: 12, t: "Integer to Roman", d: "Medium", freq: 71, tags: [] },
    { id: 24, t: "Swap Nodes in Pairs", d: "Medium", freq: 70, tags: [] },
    { id: 31, t: "Next Permutation", d: "Medium", freq: 45, tags: [] },
    { id: 40, t: "Combination Sum II", d: "Medium", freq: 60, tags: [] },
    { id: 43, t: "Multiply Strings", d: "Medium", freq: 44, tags: [] },
    { id: 63, t: "Unique Paths II", d: "Medium", freq: 45, tags: [] },
    { id: 74, t: "Search a 2D Matrix", d: "Medium", freq: 54, tags: [] },
    { id: 103, t: "Binary Tree Zigzag Level Order Traversal", d: "Medium", freq: 64, tags: [] },
    { id: 123, t: "Best Time to Buy and Sell Stock III", d: "Hard", freq: 54, tags: [] },
    { id: 134, t: "Gas Station", d: "Medium", freq: 48, tags: [] },
    { id: 160, t: "Intersection of Two Linked Lists", d: "Easy", freq: 64, tags: [] },
    { id: 188, t: "Best Time to Buy and Sell Stock IV", d: "Hard", freq: 50, tags: [] },
    { id: 189, t: "Rotate Array", d: "Medium", freq: 45, tags: [] },
    { id: 221, t: "Maximal Square", d: "Medium", freq: 50, tags: [] },
    { id: 301, t: "Remove Invalid Parentheses", d: "Hard", freq: 50, tags: [] },
    { id: 348, t: "Design Tic-Tac-Toe", d: "Medium", freq: 59, tags: [] },
    { id: 378, t: "Kth Smallest Element in a Sorted Matrix", d: "Medium", freq: 65, tags: [] },
    { id: 381, t: "Insert Delete GetRandom O(1) - Duplicates allowed", d: "Hard", freq: 37, tags: [] },
    { id: 460, t: "LFU Cache", d: "Hard", freq: 49, tags: [] },
    { id: 475, t: "Heaters", d: "Medium", freq: 42, tags: [] },
    { id: 489, t: "Robot Room Cleaner", d: "Hard", freq: 78, tags: [] },
    { id: 581, t: "Shortest Unsorted Continuous Subarray", d: "Medium", freq: 38, tags: [] },
    { id: 628, t: "Maximum Product of Three Numbers", d: "Easy", freq: 46, tags: [] },
    { id: 642, t: "Design Search Autocomplete System", d: "Hard", freq: 50, tags: [] },
    { id: 691, t: "Stickers to Spell Word", d: "Hard", freq: 51, tags: [] },
    { id: 714, t: "Best Time to Buy and Sell Stock with Transaction Fee", d: "Medium", freq: 72, tags: [] },
    { id: 945, t: "Minimum Increment to Make Array Unique", d: "Medium", freq: 61, tags: [] },
    { id: 959, t: "Regions Cut By Slashes", d: "Medium", freq: 78, tags: [] },
    { id: 983, t: "Minimum Cost For Tickets", d: "Medium", freq: 67, tags: [] },
    { id: 1004, t: "Max Consecutive Ones III", d: "Medium", freq: 68, tags: [] },
    { id: 1245, t: "Tree Diameter", d: "Medium", freq: 61, tags: [] },
    { id: 1813, t: "Sentence Similarity III", d: "Medium", freq: 48, tags: [] },
    { id: 1944, t: "Number of Visible People in a Queue", d: "Hard", freq: 73, tags: [] },
    { id: 2096, t: "Step-By-Step Directions From a Binary Tree Node to Another", d: "Medium", freq: 56, tags: [] },
    { id: 2115, t: "Find All Possible Recipes from Given Supplies", d: "Medium", freq: 57, tags: [] },
    { id: 2145, t: "Count the Hidden Sequences", d: "Medium", freq: 57, tags: [] },
    { id: 2422, t: "Merge Operations to Turn Array Into a Palindrome", d: "Medium", freq: 69, tags: [] },
    { id: 13, t: "Roman to Integer", d: "Easy", freq: 67, tags: [] },
    { id: 19, t: "Remove Nth Node From End of List", d: "Medium", freq: 52, tags: [] },
    { id: 21, t: "Merge Two Sorted Lists", d: "Easy", freq: 68, tags: [] },
    { id: 32, t: "Longest Valid Parentheses", d: "Hard", freq: 39, tags: [] },
    { id: 80, t: "Remove Duplicates from Sorted Array II", d: "Medium", freq: 65, tags: [] },
    { id: 84, t: "Largest Rectangle in Histogram", d: "Hard", freq: 50, tags: [] },
    { id: 92, t: "Reverse Linked List II", d: "Medium", freq: 52, tags: [] },
    { id: 113, t: "Path Sum II", d: "Medium", freq: 62, tags: [] },
    { id: 125, t: "Valid Palindrome", d: "Easy", freq: 53, tags: [] },
    { id: 135, t: "Candy", d: "Hard", freq: 49, tags: [] },
    { id: 138, t: "Copy List with Random Pointer", d: "Medium", freq: 63, tags: [] },
    { id: 151, t: "Reverse Words in a String", d: "Medium", freq: 57, tags: [] },
    { id: 152, t: "Maximum Product Subarray", d: "Medium", freq: 37, tags: [] },
    { id: 159, t: "Longest Substring with At Most Two Distinct Characters", d: "Medium", freq: 57, tags: [] },
    { id: 179, t: "Largest Number", d: "Medium", freq: 43, tags: [] },
    { id: 287, t: "Find the Duplicate Number", d: "Medium", freq: 64, tags: [] },
    { id: 298, t: "Binary Tree Longest Consecutive Sequence", d: "Medium", freq: 55, tags: [] },
    { id: 305, t: "Number of Islands II", d: "Hard", freq: 41, tags: [] },
    { id: 309, t: "Best Time to Buy and Sell Stock with Cooldown", d: "Medium", freq: 62, tags: [] },
    { id: 317, t: "Shortest Distance from All Buildings", d: "Hard", freq: 45, tags: [] },
    { id: 337, t: "House Robber III", d: "Medium", freq: 56, tags: [] },
    { id: 340, t: "Longest Substring with At Most K Distinct Characters", d: "Medium", freq: 50, tags: [] },
    { id: 358, t: "Rearrange String k Distance Apart", d: "Hard", freq: 40, tags: [] },
    { id: 402, t: "Remove K Digits", d: "Medium", freq: 37, tags: [] },
    { id: 408, t: "Valid Word Abbreviation", d: "Easy", freq: 37, tags: [] },
    { id: 443, t: "String Compression", d: "Medium", freq: 60, tags: [] },
    { id: 452, t: "Minimum Number of Arrows to Burst Balloons", d: "Medium", freq: 62, tags: [] },
    { id: 472, t: "Concatenated Words", d: "Hard", freq: 50, tags: [] },
    { id: 518, t: "Coin Change II", d: "Medium", freq: 60, tags: [] },
    { id: 543, t: "Diameter of Binary Tree", d: "Easy", freq: 66, tags: [] },
    { id: 567, t: "Permutation in String", d: "Medium", freq: 49, tags: [] },
    { id: 616, t: "Add Bold Tag in String", d: "Medium", freq: 51, tags: [] },
    { id: 648, t: "Replace Words", d: "Medium", freq: 69, tags: [] },
    { id: 650, t: "2 Keys Keyboard", d: "Medium", freq: 59, tags: [] },
    { id: 662, t: "Maximum Width of Binary Tree", d: "Medium", freq: 46, tags: [] },
    { id: 673, t: "Number of Longest Increasing Subsequence", d: "Medium", freq: 52, tags: [] },
    { id: 679, t: "24 Game", d: "Hard", freq: 60, tags: [] },
    { id: 680, t: "Valid Palindrome II", d: "Easy", freq: 44, tags: [] },
    { id: 716, t: "Max Stack", d: "Hard", freq: 46, tags: [] },
    { id: 729, t: "My Calendar I", d: "Medium", freq: 58, tags: [] },
    { id: 740, t: "Delete and Earn", d: "Medium", freq: 57, tags: [] },
    { id: 784, t: "Letter Case Permutation", d: "Medium", freq: 76, tags: [] },
    { id: 785, t: "Is Graph Bipartite?", d: "Medium", freq: 59, tags: [] },
    { id: 799, t: "Champagne Tower", d: "Medium", freq: 64, tags: [] },
    { id: 863, t: "All Nodes Distance K in Binary Tree", d: "Medium", freq: 68, tags: [] },
    { id: 909, t: "Snakes and Ladders", d: "Medium", freq: 48, tags: [] },
    { id: 962, t: "Maximum Width Ramp", d: "Medium", freq: 56, tags: [] },
    { id: 981, t: "Time Based Key-Value Store", d: "Medium", freq: 50, tags: [] },
    { id: 1010, t: "Pairs of Songs With Total Durations Divisible by 60", d: "Medium", freq: 54, tags: [] },
    { id: 1044, t: "Longest Duplicate Substring", d: "Hard", freq: 31, tags: [] },
    { id: 1091, t: "Shortest Path in Binary Matrix", d: "Medium", freq: 52, tags: [] },
    { id: 1268, t: "Search Suggestions System", d: "Medium", freq: 65, tags: [] },
    { id: 1302, t: "Deepest Leaves Sum", d: "Medium", freq: 87, tags: [] },
    { id: 1335, t: "Minimum Difficulty of a Job Schedule", d: "Hard", freq: 60, tags: [] },
    { id: 1423, t: "Maximum Points You Can Obtain from Cards", d: "Medium", freq: 58, tags: [] },
    { id: 1642, t: "Furthest Building You Can Reach", d: "Medium", freq: 51, tags: [] },
    { id: 2050, t: "Parallel Courses III", d: "Hard", freq: 67, tags: [] },
    { id: 2502, t: "Design Memory Allocator", d: "Medium", freq: 50, tags: [] },
    { id: 2506, t: "Count Pairs Of Similar Strings", d: "Easy", freq: 74, tags: [] },
    { id: 2523, t: "Closest Prime Numbers in Range", d: "Medium", freq: 52, tags: [] },
    { id: 2625, t: "Flatten Deeply Nested Array", d: "Medium", freq: 66, tags: [] },
    { id: 2673, t: "Make Costs of Paths Equal in a Binary Tree", d: "Medium", freq: 59, tags: [] },
    { id: 2, t: "Add Two Numbers", d: "Medium", freq: 49, tags: [] },
    { id: 4, t: "Median of Two Sorted Arrays", d: "Hard", freq: 47, tags: [] },
    { id: 36, t: "Valid Sudoku", d: "Medium", freq: 65, tags: [] },
    { id: 50, t: "Pow(x, n)", d: "Medium", freq: 39, tags: [] },
    { id: 57, t: "Insert Interval", d: "Medium", freq: 45, tags: [] },
    { id: 59, t: "Spiral Matrix II", d: "Medium", freq: 75, tags: [] },
    { id: 66, t: "Plus One", d: "Easy", freq: 50, tags: [] },
    { id: 82, t: "Remove Duplicates from Sorted List II", d: "Medium", freq: 52, tags: [] },
    { id: 91, t: "Decode Ways", d: "Medium", freq: 38, tags: [] },
    { id: 96, t: "Unique Binary Search Trees", d: "Medium", freq: 64, tags: [] },
    { id: 99, t: "Recover Binary Search Tree", d: "Medium", freq: 60, tags: [] },
    { id: 101, t: "Symmetric Tree", d: "Easy", freq: 61, tags: [] },
    { id: 108, t: "Convert Sorted Array to Binary Search Tree", d: "Easy", freq: 76, tags: [] },
    { id: 112, t: "Path Sum", d: "Easy", freq: 55, tags: [] },
    { id: 148, t: "Sort List", d: "Medium", freq: 65, tags: [] },
    { id: 167, t: "Two Sum II - Input Array Is Sorted", d: "Medium", freq: 65, tags: [] },
    { id: 202, t: "Happy Number", d: "Easy", freq: 60, tags: [] },
    { id: 208, t: "Implement Trie (Prefix Tree)", d: "Medium", freq: 70, tags: [] },
    { id: 226, t: "Invert Binary Tree", d: "Easy", freq: 80, tags: [] },
    { id: 230, t: "Kth Smallest Element in a BST", d: "Medium", freq: 77, tags: [] },
    { id: 232, t: "Implement Queue using Stacks", d: "Easy", freq: 70, tags: [] },
    { id: 240, t: "Search a 2D Matrix II", d: "Medium", freq: 57, tags: [] },
    { id: 255, t: "Verify Preorder Sequence in Binary Search Tree", d: "Medium", freq: 52, tags: [] },
    { id: 259, t: "3Sum Smaller", d: "Medium", freq: 51, tags: [] },
    { id: 261, t: "Graph Valid Tree", d: "Medium", freq: 50, tags: [] },
    { id: 271, t: "Encode and Decode Strings", d: "Medium", freq: 52, tags: [] },
    { id: 277, t: "Find the Celebrity", d: "Medium", freq: 49, tags: [] },
    { id: 280, t: "Wiggle Sort", d: "Medium", freq: 69, tags: [] },
    { id: 282, t: "Expression Add Operators", d: "Hard", freq: 43, tags: [] },
    { id: 311, t: "Sparse Matrix Multiplication", d: "Medium", freq: 69, tags: [] },
    { id: 323, t: "Number of Connected Components in an Undirected Graph", d: "Medium", freq: 65, tags: [] },
    { id: 325, t: "Maximum Size Subarray Sum Equals k", d: "Medium", freq: 51, tags: [] },
    { id: 377, t: "Combination Sum IV", d: "Medium", freq: 55, tags: [] },
    { id: 413, t: "Arithmetic Slices", d: "Medium", freq: 65, tags: [] },
    { id: 424, t: "Longest Repeating Character Replacement", d: "Medium", freq: 60, tags: [] },
    { id: 435, t: "Non-overlapping Intervals", d: "Medium", freq: 57, tags: [] },
    { id: 440, t: "K-th Smallest in Lexicographical Order", d: "Hard", freq: 46, tags: [] },
    { id: 445, t: "Add Two Numbers II", d: "Medium", freq: 63, tags: [] },
    { id: 456, t: "132 Pattern", d: "Medium", freq: 35, tags: [] },
    { id: 468, t: "Validate IP Address", d: "Medium", freq: 28, tags: [] },
    { id: 470, t: "Implement Rand10() Using Rand7()", d: "Medium", freq: 46, tags: [] },
    { id: 496, t: "Next Greater Element I", d: "Easy", freq: 76, tags: [] },
    { id: 498, t: "Diagonal Traverse", d: "Medium", freq: 67, tags: [] },
    { id: 505, t: "The Maze II", d: "Medium", freq: 55, tags: [] },
    { id: 525, t: "Contiguous Array", d: "Medium", freq: 52, tags: [] },
    { id: 529, t: "Minesweeper", d: "Medium", freq: 69, tags: [] },
    { id: 593, t: "Valid Square", d: "Medium", freq: 45, tags: [] },
    { id: 601, t: "Human Traffic of Stadium", d: "Hard", freq: 51, tags: [] },
    { id: 606, t: "Construct String from Binary Tree", d: "Medium", freq: 71, tags: [] },
    { id: 621, t: "Task Scheduler", d: "Medium", freq: 63, tags: [] },
    { id: 658, t: "Find K Closest Elements", d: "Medium", freq: 50, tags: [] },
    { id: 692, t: "Top K Frequent Words", d: "Medium", freq: 60, tags: [] },
    { id: 696, t: "Count Binary Substrings", d: "Easy", freq: 70, tags: [] },
    { id: 708, t: "Insert into a Sorted Circular Linked List", d: "Medium", freq: 39, tags: [] },
    { id: 721, t: "Accounts Merge", d: "Medium", freq: 61, tags: [] },
    { id: 723, t: "Candy Crush", d: "Medium", freq: 78, tags: [] },
    { id: 726, t: "Number of Atoms", d: "Hard", freq: 65, tags: [] },
    { id: 829, t: "Consecutive Numbers Sum", d: "Hard", freq: 43, tags: [] },
    { id: 941, t: "Valid Mountain Array", d: "Easy", freq: 35, tags: [] },
    { id: 992, t: "Subarrays with K Different Integers", d: "Hard", freq: 68, tags: [] },
    { id: 993, t: "Cousins in Binary Tree", d: "Easy", freq: 59, tags: [] },
    { id: 1094, t: "Car Pooling", d: "Medium", freq: 56, tags: [] },
    { id: 1136, t: "Parallel Courses", d: "Medium", freq: 62, tags: [] },
    { id: 1143, t: "Longest Common Subsequence", d: "Medium", freq: 59, tags: [] },
    { id: 1216, t: "Valid Palindrome III", d: "Hard", freq: 49, tags: [] },
    { id: 1235, t: "Maximum Profit in Job Scheduling", d: "Hard", freq: 55, tags: [] },
    { id: 1237, t: "Find Positive Integer Solution for a Given Equation", d: "Medium", freq: 70, tags: [] },
    { id: 1248, t: "Count Number of Nice Subarrays", d: "Medium", freq: 75, tags: [] },
    { id: 1257, t: "Smallest Common Region", d: "Medium", freq: 68, tags: [] },
    { id: 1383, t: "Maximum Performance of a Team", d: "Hard", freq: 48, tags: [] },
    { id: 1570, t: "Dot Product of Two Sparse Vectors", d: "Medium", freq: 90, tags: [] },
    { id: 1574, t: "Shortest Subarray to be Removed to Make Array Sorted", d: "Medium", freq: 51, tags: [] },
    { id: 1669, t: "Merge In Between Linked Lists", d: "Medium", freq: 83, tags: [] },
    { id: 1769, t: "Minimum Number of Operations to Move All Balls to Each Box", d: "Medium", freq: 90, tags: [] },
    { id: 1860, t: "Incremental Memory Leak", d: "Medium", freq: 73, tags: [] },
    { id: 1882, t: "Process Tasks Using Servers", d: "Medium", freq: 42, tags: [] },
    { id: 2080, t: "Range Frequency Queries", d: "Medium", freq: 43, tags: [] },
    { id: 2134, t: "Minimum Swaps to Group All 1's Together II", d: "Medium", freq: 66, tags: [] },
    { id: 2235, t: "Add Two Integers", d: "Easy", freq: 88, tags: [] },
    { id: 2414, t: "Length of the Longest Alphabetical Continuous Substring", d: "Medium", freq: 61, tags: [] },
    { id: 2456, t: "Most Popular Video Creator", d: "Medium", freq: 45, tags: [] },
    { id: 2530, t: "Maximal Score After Applying K Operations", d: "Medium", freq: 64, tags: [] },
    { id: 2537, t: "Count the Number of Good Subarrays", d: "Medium", freq: 66, tags: [] },
    { id: 2551, t: "Put Marbles in Bags", d: "Hard", freq: 72, tags: [] },
    { id: 2561, t: "Rearranging Fruits", d: "Hard", freq: 57, tags: [] },
    { id: 2640, t: "Find the Score of All Prefixes of an Array", d: "Medium", freq: 73, tags: [] },
    { id: 2672, t: "Number of Adjacent Elements With the Same Color", d: "Medium", freq: 60, tags: [] },
    { id: 2694, t: "Event Emitter", d: "Medium", freq: 75, tags: [] },
    { id: 2799, t: "Count Complete Subarrays in an Array", d: "Medium", freq: 76, tags: [] },
    { id: 2931, t: "Maximum Spending After Buying Items", d: "Hard", freq: 61, tags: [] },
    { id: 2945, t: "Find Maximum Non-decreasing Array Length", d: "Hard", freq: 19, tags: [] },
    { id: 3086, t: "Minimum Moves to Pick K Ones", d: "Hard", freq: 22, tags: [] },
  ],
  Nvidia: [
    { id: 1, t: "Two Sum", d: "Easy", freq: 58, tags: [] },
    { id: 2, t: "Add Two Numbers", d: "Medium", freq: 49, tags: [] },
    { id: 3, t: "Longest Substring Without Repeating Characters", d: "Medium", freq: 39, tags: [] },
    { id: 4, t: "Median of Two Sorted Arrays", d: "Hard", freq: 47, tags: [] },
    { id: 8, t: "String to Integer (atoi)", d: "Medium", freq: 21, tags: [] },
    { id: 11, t: "Container With Most Water", d: "Medium", freq: 60, tags: [] },
    { id: 12, t: "Integer to Roman", d: "Medium", freq: 71, tags: [] },
    { id: 13, t: "Roman to Integer", d: "Easy", freq: 67, tags: [] },
    { id: 15, t: "3Sum", d: "Medium", freq: 39, tags: [] },
    { id: 17, t: "Letter Combinations of a Phone Number", d: "Medium", freq: 66, tags: [] },
    { id: 20, t: "Valid Parentheses", d: "Easy", freq: 44, tags: [] },
    { id: 21, t: "Merge Two Sorted Lists", d: "Easy", freq: 68, tags: [] },
    { id: 22, t: "Generate Parentheses", d: "Medium", freq: 79, tags: [] },
    { id: 23, t: "Merge k Sorted Lists", d: "Hard", freq: 60, tags: [] },
    { id: 33, t: "Search in Rotated Sorted Array", d: "Medium", freq: 45, tags: [] },
    { id: 39, t: "Combination Sum", d: "Medium", freq: 77, tags: [] },
    { id: 42, t: "Trapping Rain Water", d: "Hard", freq: 68, tags: [] },
    { id: 48, t: "Rotate Image", d: "Medium", freq: 80, tags: [] },
    { id: 49, t: "Group Anagrams", d: "Medium", freq: 73, tags: [] },
    { id: 50, t: "Pow(x, n)", d: "Medium", freq: 39, tags: [] },
    { id: 51, t: "N-Queens", d: "Hard", freq: 76, tags: [] },
    { id: 53, t: "Maximum Subarray", d: "Medium", freq: 53, tags: [] },
    { id: 54, t: "Spiral Matrix", d: "Medium", freq: 57, tags: [] },
    { id: 55, t: "Jump Game", d: "Medium", freq: 41, tags: [] },
    { id: 56, t: "Merge Intervals", d: "Medium", freq: 52, tags: [] },
    { id: 64, t: "Minimum Path Sum", d: "Medium", freq: 68, tags: [] },
    { id: 69, t: "Sqrt(x)", d: "Easy", freq: 42, tags: [] },
    { id: 70, t: "Climbing Stairs", d: "Easy", freq: 54, tags: [] },
    { id: 73, t: "Set Matrix Zeroes", d: "Medium", freq: 63, tags: [] },
    { id: 74, t: "Search a 2D Matrix", d: "Medium", freq: 54, tags: [] },
    { id: 79, t: "Word Search", d: "Medium", freq: 48, tags: [] },
    { id: 91, t: "Decode Ways", d: "Medium", freq: 38, tags: [] },
    { id: 92, t: "Reverse Linked List II", d: "Medium", freq: 52, tags: [] },
    { id: 1046, t: "Last Stone Weight", d: "Easy", freq: 67, tags: [] },
    { id: 115, t: "Distinct Subsequences", d: "Hard", freq: 52, tags: [] },
    { id: 118, t: "Pascal's Triangle", d: "Easy", freq: 79, tags: [] },
    { id: 119, t: "Pascal's Triangle II", d: "Easy", freq: 68, tags: [] },
    { id: 121, t: "Best Time to Buy and Sell Stock", d: "Easy", freq: 57, tags: [] },
    { id: 122, t: "Best Time to Buy and Sell Stock II", d: "Medium", freq: 71, tags: [] },
    { id: 138, t: "Copy List with Random Pointer", d: "Medium", freq: 63, tags: [] },
    { id: 139, t: "Word Break", d: "Medium", freq: 50, tags: [] },
    { id: 141, t: "Linked List Cycle", d: "Easy", freq: 54, tags: [] },
    { id: 146, t: "LRU Cache", d: "Medium", freq: 48, tags: [] },
    { id: 150, t: "Evaluate Reverse Polish Notation", d: "Medium", freq: 58, tags: [] },
    { id: 155, t: "Min Stack", d: "Medium", freq: 58, tags: [] },
    { id: 160, t: "Intersection of Two Linked Lists", d: "Easy", freq: 64, tags: [] },
    { id: 162, t: "Find Peak Element", d: "Medium", freq: 47, tags: [] },
    { id: 166, t: "Fraction to Recurring Decimal", d: "Medium", freq: 31, tags: [] },
    { id: 188, t: "Best Time to Buy and Sell Stock IV", d: "Hard", freq: 50, tags: [] },
    { id: 190, t: "Reverse Bits", d: "Easy", freq: 69, tags: [] },
    { id: 198, t: "House Robber", d: "Medium", freq: 53, tags: [] },
    { id: 200, t: "Number of Islands", d: "Medium", freq: 65, tags: [] },
    { id: 206, t: "Reverse Linked List", d: "Easy", freq: 81, tags: [] },
    { id: 209, t: "Minimum Size Subarray Sum", d: "Medium", freq: 52, tags: [] },
    { id: 215, t: "Kth Largest Element in an Array", d: "Medium", freq: 69, tags: [] },
    { id: 221, t: "Maximal Square", d: "Medium", freq: 50, tags: [] },
    { id: 238, t: "Product of Array Except Self", d: "Medium", freq: 69, tags: [] },
    { id: 268, t: "Missing Number", d: "Easy", freq: 72, tags: [] },
    { id: 274, t: "H-Index", d: "Medium", freq: 42, tags: [] },
    { id: 283, t: "Move Zeroes", d: "Easy", freq: 64, tags: [] },
    { id: 287, t: "Find the Duplicate Number", d: "Medium", freq: 64, tags: [] },
    { id: 295, t: "Find Median from Data Stream", d: "Hard", freq: 55, tags: [] },
    { id: 300, t: "Longest Increasing Subsequence", d: "Medium", freq: 60, tags: [] },
    { id: 3171, t: "Find Subarray With Bitwise OR Closest to K", d: "Hard", freq: 31, tags: [] },
    { id: 338, t: "Counting Bits", d: "Easy", freq: 81, tags: [] },
    { id: 347, t: "Top K Frequent Elements", d: "Medium", freq: 67, tags: [] },
    { id: 349, t: "Intersection of Two Arrays", d: "Easy", freq: 78, tags: [] },
    { id: 380, t: "Insert Delete GetRandom O(1)", d: "Medium", freq: 55, tags: [] },
    { id: 382, t: "Linked List Random Node", d: "Medium", freq: 65, tags: [] },
    { id: 387, t: "First Unique Character in a String", d: "Easy", freq: 66, tags: [] },
    { id: 394, t: "Decode String", d: "Medium", freq: 63, tags: [] },
    { id: 399, t: "Evaluate Division", d: "Medium", freq: 64, tags: [] },
    { id: 412, t: "Fizz Buzz", d: "Easy", freq: 76, tags: [] },
    { id: 421, t: "Maximum XOR of Two Numbers in an Array", d: "Medium", freq: 54, tags: [] },
    { id: 443, t: "String Compression", d: "Medium", freq: 60, tags: [] },
    { id: 460, t: "LFU Cache", d: "Hard", freq: 49, tags: [] },
    { id: 490, t: "The Maze", d: "Medium", freq: 60, tags: [] },
    { id: 494, t: "Target Sum", d: "Medium", freq: 52, tags: [] },
    { id: 503, t: "Next Greater Element II", d: "Medium", freq: 69, tags: [] },
    { id: 509, t: "Fibonacci Number", d: "Easy", freq: 74, tags: [] },
    { id: 528, t: "Random Pick with Weight", d: "Medium", freq: 49, tags: [] },
    { id: 538, t: "Convert BST to Greater Tree", d: "Medium", freq: 0, tags: [] },
    { id: 543, t: "Diameter of Binary Tree", d: "Easy", freq: 66, tags: [] },
    { id: 560, t: "Subarray Sum Equals K", d: "Medium", freq: 47, tags: [] },
    { id: 621, t: "Task Scheduler", d: "Medium", freq: 63, tags: [] },
    { id: 628, t: "Maximum Product of Three Numbers", d: "Easy", freq: 46, tags: [] },
    { id: 636, t: "Exclusive Time of Functions", d: "Medium", freq: 66, tags: [] },
    { id: 647, t: "Palindromic Substrings", d: "Medium", freq: 73, tags: [] },
    { id: 689, t: "Maximum Sum of 3 Non-Overlapping Subarrays", d: "Hard", freq: 0, tags: [] },
    { id: 692, t: "Top K Frequent Words", d: "Medium", freq: 60, tags: [] },
    { id: 696, t: "Count Binary Substrings", d: "Easy", freq: 70, tags: [] },
    { id: 703, t: "Kth Largest Element in a Stream", d: "Easy", freq: 61, tags: [] },
    { id: 713, t: "Subarray Product Less Than K", d: "Medium", freq: 54, tags: [] },
    { id: 735, t: "Asteroid Collision", d: "Medium", freq: 48, tags: [] },
    { id: 739, t: "Daily Temperatures", d: "Medium", freq: 69, tags: [] },
    { id: 761, t: "Special Binary String", d: "Hard", freq: 79, tags: [] },
    { id: 773, t: "Sliding Puzzle", d: "Hard", freq: 75, tags: [] },
    { id: 806, t: "Number of Lines To Write String", d: "Easy", freq: 73, tags: [] },
    { id: 820, t: "Find Eventual Safe States", d: "Medium", freq: 0, tags: [] },
    { id: 844, t: "Backspace String Compare", d: "Easy", freq: 50, tags: [] },
    { id: 862, t: "Shortest Subarray with Sum at Least K", d: "Hard", freq: 33, tags: [] },
    { id: 875, t: "Koko Eating Bananas", d: "Medium", freq: 50, tags: [] },
    { id: 881, t: "Boats to Save People", d: "Medium", freq: 62, tags: [] },
    { id: 894, t: "All Possible Full Binary Trees", d: "Medium", freq: 83, tags: [] },
    { id: 918, t: "Maximum Sum Circular Subarray", d: "Medium", freq: 50, tags: [] },
    { id: 924, t: "Minimize Malware Spread", d: "Hard", freq: 43, tags: [] },
    { id: 931, t: "Minimum Falling Path Sum", d: "Medium", freq: 61, tags: [] },
    { id: 973, t: "K Closest Points to Origin", d: "Medium", freq: 69, tags: [] },
    { id: 994, t: "Rotting Oranges", d: "Medium", freq: 59, tags: [] },
    { id: 1004, t: "Max Consecutive Ones III", d: "Medium", freq: 68, tags: [] },
    { id: 1010, t: "Pairs of Songs With Total Durations Divisible by 60", d: "Medium", freq: 54, tags: [] },
    { id: 1011, t: "Capacity To Ship Packages Within D Days", d: "Medium", freq: 74, tags: [] },
    { id: 1014, t: "Best Sightseeing Pair", d: "Medium", freq: 0, tags: [] },
    { id: 1041, t: "Robot Bounded In Circle", d: "Medium", freq: 57, tags: [] },
    { id: 1046, t: "Last Stone Weight", d: "Easy", freq: 67, tags: [] },
    { id: 1106, t: "Parsing A Boolean Expression", d: "Hard", freq: 70, tags: [] },
    { id: 1143, t: "Longest Common Subsequence", d: "Medium", freq: 59, tags: [] },
    { id: 1190, t: "Reverse Substrings Between Each Pair of Parentheses", d: "Medium", freq: 72, tags: [] },
    { id: 1200, t: "Minimum Absolute Difference", d: "Easy", freq: 75, tags: [] },
    { id: 1209, t: "Remove All Adjacent Duplicates in String II", d: "Medium", freq: 61, tags: [] },
    { id: 1242, t: "Web Crawler Multithreaded", d: "Medium", freq: 51, tags: [] },
    { id: 1245, t: "Tree Diameter", d: "Medium", freq: 61, tags: [] },
    { id: 1247, t: "Minimum Swaps to Make Strings Equal", d: "Medium", freq: 65, tags: [] },
    { id: 1268, t: "Search Suggestions System", d: "Medium", freq: 65, tags: [] },
    { id: 127, t: "Word Ladder", d: "Hard", freq: 46, tags: [] },
    { id: 128, t: "Longest Consecutive Sequence", d: "Medium", freq: 47, tags: [] },
    { id: 133, t: "Clone Graph", d: "Medium", freq: 65, tags: [] },
    { id: 134, t: "Gas Station", d: "Medium", freq: 48, tags: [] },
    { id: 1353, t: "Maximum Number of Events That Can Be Attended", d: "Medium", freq: 39, tags: [] },
    { id: 139, t: "Word Break", d: "Medium", freq: 50, tags: [] },
    { id: 141, t: "Linked List Cycle", d: "Easy", freq: 54, tags: [] },
    { id: 143, t: "Reorder List", d: "Medium", freq: 65, tags: [] },
    { id: 146, t: "LRU Cache", d: "Medium", freq: 48, tags: [] },
    { id: 151, t: "Reverse Words in a String", d: "Medium", freq: 57, tags: [] },
    { id: 1570, t: "Dot Product of Two Sparse Vectors", d: "Medium", freq: 90, tags: [] },
    { id: 1610, t: "Maximum Number of Visible Points", d: "Hard", freq: 38, tags: [] },
    { id: 162, t: "Find Peak Element", d: "Medium", freq: 47, tags: [] },
    { id: 1669, t: "Merge In Between Linked Lists", d: "Medium", freq: 83, tags: [] },
    { id: 1710, t: "Maximum Units on a Truck", d: "Easy", freq: 75, tags: [] },
    { id: 1752, t: "Check if Array Is Sorted and Rotated", d: "Easy", freq: 57, tags: [] },
    { id: 179, t: "Largest Number", d: "Medium", freq: 43, tags: [] },
    { id: 1834, t: "Single-Threaded CPU", d: "Medium", freq: 48, tags: [] },
    { id: 190, t: "Reverse Bits", d: "Easy", freq: 69, tags: [] },
    { id: 1910, t: "Remove All Occurrences of a Substring", d: "Medium", freq: 79, tags: [] },
    { id: 1944, t: "Number of Visible People in a Queue", d: "Hard", freq: 73, tags: [] },
    { id: 2008, t: "Maximum Earnings From Taxi", d: "Medium", freq: 47, tags: [] },
    { id: 206, t: "Reverse Linked List", d: "Easy", freq: 81, tags: [] },
    { id: 2062, t: "Count Vowel Substrings of a String", d: "Easy", freq: 73, tags: [] },
    { id: 207, t: "Course Schedule", d: "Medium", freq: 52, tags: [] },
    { id: 209, t: "Minimum Size Subarray Sum", d: "Medium", freq: 52, tags: [] },
    { id: 210, t: "Course Schedule II", d: "Medium", freq: 56, tags: [] },
    { id: 213, t: "House Robber II", d: "Medium", freq: 45, tags: [] },
    { id: 215, t: "Kth Largest Element in an Array", d: "Medium", freq: 69, tags: [] },
    { id: 221, t: "Maximal Square", d: "Medium", freq: 50, tags: [] },
    { id: 223, t: "Rectangle Area", d: "Medium", freq: 50, tags: [] },
    { id: 227, t: "Basic Calculator II", d: "Medium", freq: 47, tags: [] },
    { id: 231, t: "Power of Two", d: "Easy", freq: 50, tags: [] },
    { id: 2342, t: "Max Sum of a Pair With Equal Sum of Digits", d: "Medium", freq: 66, tags: [] },
    { id: 236, t: "Lowest Common Ancestor of a Binary Tree", d: "Medium", freq: 69, tags: [] },
    { id: 239, t: "Sliding Window Maximum", d: "Hard", freq: 49, tags: [] },
    { id: 2438, t: "Range Product Queries of Powers", d: "Medium", freq: 61, tags: [] },
    { id: 2461, t: "Maximum Sum of Distinct Subarrays With Length K", d: "Medium", freq: 43, tags: [] },
    { id: 2484, t: "Count Palindromic Subsequences", d: "Hard", freq: 41, tags: [] },
    { id: 253, t: "Meeting Rooms II", d: "Medium", freq: 53, tags: [] },
    { id: 2539, t: "Count the Number of Good Subsequences", d: "Medium", freq: 49, tags: [] },
    { id: 2571, t: "Minimum Operations to Reduce an Integer to 0", d: "Medium", freq: 63, tags: [] },
    { id: 2592, t: "Maximize Greatness of an Array", d: "Medium", freq: 62, tags: [] },
    { id: 268, t: "Missing Number", d: "Easy", freq: 72, tags: [] },
    { id: 274, t: "H-Index", d: "Medium", freq: 42, tags: [] },
    { id: 283, t: "Move Zeroes", d: "Easy", freq: 64, tags: [] },
    { id: 287, t: "Find the Duplicate Number", d: "Medium", freq: 64, tags: [] },
    { id: 289, t: "Game of Life", d: "Medium", freq: 73, tags: [] },
    { id: 295, t: "Find Median from Data Stream", d: "Hard", freq: 55, tags: [] },
    { id: 297, t: "Serialize and Deserialize Binary Tree", d: "Hard", freq: 61, tags: [] },
    { id: 300, t: "Longest Increasing Subsequence", d: "Medium", freq: 60, tags: [] },
    { id: 317, t: "Shortest Distance from All Buildings", d: "Hard", freq: 45, tags: [] },
    { id: 3193, t: "Count the Number of Inversions", d: "Hard", freq: 31, tags: [] },
    { id: 322, t: "Coin Change", d: "Medium", freq: 49, tags: [] },
    { id: 329, t: "Longest Increasing Path in a Matrix", d: "Hard", freq: 57, tags: [] },
    { id: 332, t: "Reconstruct Itinerary", d: "Hard", freq: 45, tags: [] },
    { id: 338, t: "Counting Bits", d: "Easy", freq: 81, tags: [] },
    { id: 3437, t: "Permutations III", d: "Medium", freq: 87, tags: [] },
    { id: 344, t: "Reverse String", d: "Easy", freq: 81, tags: [] },
    { id: 347, t: "Top K Frequent Elements", d: "Medium", freq: 67, tags: [] },
    { id: 349, t: "Intersection of Two Arrays", d: "Easy", freq: 78, tags: [] },
    { id: 353, t: "Design Snake Game", d: "Medium", freq: 40, tags: [] },
    { id: 380, t: "Insert Delete GetRandom O(1)", d: "Medium", freq: 55, tags: [] },
    { id: 382, t: "Linked List Random Node", d: "Medium", freq: 65, tags: [] },
    { id: 387, t: "First Unique Character in a String", d: "Easy", freq: 66, tags: [] },
    { id: 394, t: "Decode String", d: "Medium", freq: 63, tags: [] },
    { id: 399, t: "Evaluate Division", d: "Medium", freq: 64, tags: [] },
    { id: 403, t: "Frog Jump", d: "Hard", freq: 47, tags: [] },
    { id: 410, t: "Split Array Largest Sum", d: "Hard", freq: 61, tags: [] },
    { id: 412, t: "Fizz Buzz", d: "Easy", freq: 76, tags: [] },
    { id: 416, t: "Partition Equal Subset Sum", d: "Medium", freq: 50, tags: [] },
    { id: 421, t: "Maximum XOR of Two Numbers in an Array", d: "Medium", freq: 54, tags: [] },
    { id: 443, t: "String Compression", d: "Medium", freq: 60, tags: [] },
    { id: 452, t: "Minimum Number of Arrows to Burst Balloons", d: "Medium", freq: 62, tags: [] },
    { id: 456, t: "132 Pattern", d: "Medium", freq: 35, tags: [] },
    { id: 460, t: "LFU Cache", d: "Hard", freq: 49, tags: [] },
    { id: 465, t: "Optimal Account Balancing", d: "Hard", freq: 51, tags: [] },
    { id: 472, t: "Concatenated Words", d: "Hard", freq: 50, tags: [] },
    { id: 475, t: "Heaters", d: "Medium", freq: 42, tags: [] },
    { id: 489, t: "Robot Room Cleaner", d: "Hard", freq: 78, tags: [] },
    { id: 490, t: "The Maze", d: "Medium", freq: 60, tags: [] },
    { id: 494, t: "Target Sum", d: "Medium", freq: 52, tags: [] },
    { id: 496, t: "Next Greater Element I", d: "Easy", freq: 76, tags: [] },
    { id: 498, t: "Diagonal Traverse", d: "Medium", freq: 67, tags: [] },
    { id: 503, t: "Next Greater Element II", d: "Medium", freq: 69, tags: [] },
    { id: 509, t: "Fibonacci Number", d: "Easy", freq: 74, tags: [] },
    { id: 518, t: "Coin Change II", d: "Medium", freq: 60, tags: [] },
    { id: 528, t: "Random Pick with Weight", d: "Medium", freq: 49, tags: [] },
    { id: 535, t: "Encode and Decode TinyURL", d: "Medium", freq: 87, tags: [] },
    { id: 543, t: "Diameter of Binary Tree", d: "Easy", freq: 66, tags: [] },
    { id: 545, t: "Boundary of Binary Tree", d: "Medium", freq: 48, tags: [] },
    { id: 560, t: "Subarray Sum Equals K", d: "Medium", freq: 47, tags: [] },
    { id: 567, t: "Permutation in String", d: "Medium", freq: 49, tags: [] },
    { id: 581, t: "Shortest Unsorted Continuous Subarray", d: "Medium", freq: 38, tags: [] },
    { id: 588, t: "Design In-Memory File System", d: "Hard", freq: 48, tags: [] },
    { id: 593, t: "Valid Square", d: "Medium", freq: 45, tags: [] },
    { id: 601, t: "Human Traffic of Stadium", d: "Hard", freq: 51, tags: [] },
    { id: 605, t: "Can Place Flowers", d: "Easy", freq: 29, tags: [] },
    { id: 621, t: "Task Scheduler", d: "Medium", freq: 63, tags: [] },
    { id: 628, t: "Maximum Product of Three Numbers", d: "Easy", freq: 46, tags: [] },
    { id: 630, t: "Course Schedule III", d: "Hard", freq: 42, tags: [] },
    { id: 636, t: "Exclusive Time of Functions", d: "Medium", freq: 66, tags: [] },
    { id: 643, t: "Maximum Average Subarray I", d: "Easy", freq: 48, tags: [] },
    { id: 647, t: "Palindromic Substrings", d: "Medium", freq: 73, tags: [] },
    { id: 650, t: "2 Keys Keyboard", d: "Medium", freq: 59, tags: [] },
    { id: 652, t: "Find Duplicate Subtrees", d: "Medium", freq: 61, tags: [] },
    { id: 658, t: "Find K Closest Elements", d: "Medium", freq: 50, tags: [] },
    { id: 662, t: "Maximum Width of Binary Tree", d: "Medium", freq: 46, tags: [] },
    { id: 673, t: "Number of Longest Increasing Subsequence", d: "Medium", freq: 52, tags: [] },
    { id: 679, t: "24 Game", d: "Hard", freq: 60, tags: [] },
    { id: 680, t: "Valid Palindrome II", d: "Easy", freq: 44, tags: [] },
    { id: 688, t: "Knight Probability in Chessboard", d: "Medium", freq: 57, tags: [] },
    { id: 692, t: "Top K Frequent Words", d: "Medium", freq: 60, tags: [] },
    { id: 695, t: "Max Area of Island", d: "Medium", freq: 74, tags: [] },
    { id: 696, t: "Count Binary Substrings", d: "Easy", freq: 70, tags: [] },
    { id: 703, t: "Kth Largest Element in a Stream", d: "Easy", freq: 61, tags: [] },
    { id: 706, t: "Design HashMap", d: "Easy", freq: 67, tags: [] },
    { id: 713, t: "Subarray Product Less Than K", d: "Medium", freq: 54, tags: [] },
    { id: 716, t: "Max Stack", d: "Hard", freq: 46, tags: [] },
    { id: 718, t: "Maximum Length of Repeated Subarray", d: "Medium", freq: 51, tags: [] },
    { id: 724, t: "Find Pivot Index", d: "Easy", freq: 63, tags: [] },
    { id: 729, t: "My Calendar I", d: "Medium", freq: 58, tags: [] },
    { id: 735, t: "Asteroid Collision", d: "Medium", freq: 48, tags: [] },
    { id: 739, t: "Daily Temperatures", d: "Medium", freq: 69, tags: [] },
    { id: 741, t: "Cherry Pickup", d: "Hard", freq: 40, tags: [] },
    { id: 743, t: "Network Delay Time", d: "Medium", freq: 61, tags: [] },
    { id: 752, t: "Open the Lock", d: "Medium", freq: 61, tags: [] },
    { id: 759, t: "Employee Free Time", d: "Hard", freq: 73, tags: [] },
    { id: 761, t: "Special Binary String", d: "Hard", freq: 79, tags: [] },
    { id: 767, t: "Reorganize String", d: "Medium", freq: 57, tags: [] },
    { id: 768, t: "Max Chunks To Make Sorted II", d: "Hard", freq: 55, tags: [] },
    { id: 779, t: "K-th Symbol in Grammar", d: "Medium", freq: 48, tags: [] },
    { id: 780, t: "Reaching Points", d: "Hard", freq: 34, tags: [] },
    { id: 784, t: "Letter Case Permutation", d: "Medium", freq: 76, tags: [] },
    { id: 785, t: "Is Graph Bipartite?", d: "Medium", freq: 59, tags: [] },
    { id: 787, t: "Cheapest Flights Within K Stops", d: "Medium", freq: 42, tags: [] },
    { id: 791, t: "Custom Sort String", d: "Medium", freq: 0, tags: [] },
    { id: 799, t: "Champagne Tower", d: "Medium", freq: 64, tags: [] },
    { id: 806, t: "Number of Lines To Write String", d: "Easy", freq: 73, tags: [] },
    { id: 815, t: "Bus Routes", d: "Hard", freq: 47, tags: [] },
    { id: 820, t: "Find Eventual Safe States", d: "Medium", freq: 0, tags: [] },
    { id: 827, t: "Making A Large Island", d: "Hard", freq: 57, tags: [] },
    { id: 831, t: "Masking Personal Information", d: "Medium", freq: 55, tags: [] },
    { id: 841, t: "Keys and Rooms", d: "Medium", freq: 76, tags: [] },
    { id: 844, t: "Backspace String Compare", d: "Easy", freq: 50, tags: [] },
    { id: 849, t: "Maximize Distance to Closest Person", d: "Medium", freq: 50, tags: [] },
    { id: 852, t: "Peak Index in a Mountain Array", d: "Medium", freq: 67, tags: [] },
    { id: 853, t: "Car Fleet", d: "Medium", freq: 55, tags: [] },
    { id: 862, t: "Shortest Subarray with Sum at Least K", d: "Hard", freq: 33, tags: [] },
    { id: 863, t: "All Nodes Distance K in Binary Tree", d: "Medium", freq: 68, tags: [] },
    { id: 875, t: "Koko Eating Bananas", d: "Medium", freq: 50, tags: [] },
    { id: 881, t: "Boats to Save People", d: "Medium", freq: 62, tags: [] },
    { id: 886, t: "Possible Bipartition", d: "Medium", freq: 53, tags: [] },
    { id: 887, t: "Super Egg Drop", d: "Hard", freq: 30, tags: [] },
    { id: 894, t: "All Possible Full Binary Trees", d: "Medium", freq: 83, tags: [] },
    { id: 895, t: "Maximum Frequency Stack", d: "Hard", freq: 67, tags: [] },
    { id: 898, t: "Bitwise ORs of Subarrays", d: "Medium", freq: 57, tags: [] },
    { id: 909, t: "Snakes and Ladders", d: "Medium", freq: 48, tags: [] },
    { id: 918, t: "Maximum Sum Circular Subarray", d: "Medium", freq: 50, tags: [] },
    { id: 924, t: "Minimize Malware Spread", d: "Hard", freq: 43, tags: [] },
    { id: 931, t: "Minimum Falling Path Sum", d: "Medium", freq: 61, tags: [] },
    { id: 934, t: "Shortest Bridge", d: "Medium", freq: 60, tags: [] },
    { id: 945, t: "Minimum Increment to Make Array Unique", d: "Medium", freq: 61, tags: [] },
    { id: 947, t: "Most Stones Removed with Same Row or Column", d: "Medium", freq: 63, tags: [] },
    { id: 959, t: "Regions Cut By Slashes", d: "Medium", freq: 78, tags: [] },
    { id: 962, t: "Maximum Width Ramp", d: "Medium", freq: 56, tags: [] },
    { id: 974, t: "Subarray Sums Divisible by K", d: "Medium", freq: 56, tags: [] },
    { id: 979, t: "Distribute Coins in Binary Tree", d: "Medium", freq: 77, tags: [] },
    { id: 981, t: "Time Based Key-Value Store", d: "Medium", freq: 50, tags: [] },
    { id: 983, t: "Minimum Cost For Tickets", d: "Medium", freq: 67, tags: [] },
    { id: 992, t: "Subarrays with K Different Integers", d: "Hard", freq: 68, tags: [] },
    { id: 993, t: "Cousins in Binary Tree", d: "Easy", freq: 59, tags: [] },
    { id: 994, t: "Rotting Oranges", d: "Medium", freq: 59, tags: [] },
  ],
  Salesforce: [
    { id: 3, t: "Longest Substring Without Repeating Characters", d: "Medium", freq: 39, tags: [] },
    { id: 5, t: "Longest Palindromic Substring", d: "Medium", freq: 38, tags: [] },
    { id: 11, t: "Container With Most Water", d: "Medium", freq: 60, tags: [] },
    { id: 12, t: "Integer to Roman", d: "Medium", freq: 71, tags: [] },
    { id: 15, t: "3Sum", d: "Medium", freq: 39, tags: [] },
    { id: 20, t: "Valid Parentheses", d: "Easy", freq: 44, tags: [] },
    { id: 31, t: "Next Permutation", d: "Medium", freq: 45, tags: [] },
    { id: 33, t: "Search in Rotated Sorted Array", d: "Medium", freq: 45, tags: [] },
    { id: 39, t: "Combination Sum", d: "Medium", freq: 77, tags: [] },
    { id: 42, t: "Trapping Rain Water", d: "Hard", freq: 68, tags: [] },
    { id: 49, t: "Group Anagrams", d: "Medium", freq: 73, tags: [] },
    { id: 56, t: "Merge Intervals", d: "Medium", freq: 52, tags: [] },
    { id: 76, t: "Minimum Window Substring", d: "Hard", freq: 48, tags: [] },
    { id: 98, t: "Validate Binary Search Tree", d: "Medium", freq: 36, tags: [] },
    { id: 115, t: "Distinct Subsequences", d: "Hard", freq: 52, tags: [] },
    { id: 121, t: "Best Time to Buy and Sell Stock", d: "Easy", freq: 57, tags: [] },
    { id: 124, t: "Binary Tree Maximum Path Sum", d: "Hard", freq: 42, tags: [] },
    { id: 139, t: "Word Break", d: "Medium", freq: 50, tags: [] },
    { id: 146, t: "LRU Cache", d: "Medium", freq: 48, tags: [] },
    { id: 155, t: "Min Stack", d: "Medium", freq: 58, tags: [] },
    { id: 200, t: "Number of Islands", d: "Medium", freq: 65, tags: [] },
    { id: 210, t: "Course Schedule II", d: "Medium", freq: 56, tags: [] },
    { id: 215, t: "Kth Largest Element in an Array", d: "Medium", freq: 69, tags: [] },
    { id: 221, t: "Maximal Square", d: "Medium", freq: 50, tags: [] },
    { id: 238, t: "Product of Array Except Self", d: "Medium", freq: 69, tags: [] },
    { id: 239, t: "Sliding Window Maximum", d: "Hard", freq: 49, tags: [] },
    { id: 322, t: "Coin Change", d: "Medium", freq: 49, tags: [] },
    { id: 347, t: "Top K Frequent Elements", d: "Medium", freq: 67, tags: [] },
    { id: 410, t: "Split Array Largest Sum", d: "Hard", freq: 61, tags: [] },
    { id: 460, t: "LFU Cache", d: "Hard", freq: 49, tags: [] },
    { id: 621, t: "Task Scheduler", d: "Medium", freq: 63, tags: [] },
    { id: 628, t: "Maximum Product of Three Numbers", d: "Easy", freq: 46, tags: [] },
    { id: 735, t: "Asteroid Collision", d: "Medium", freq: 48, tags: [] },
    { id: 1268, t: "Search Suggestions System", d: "Medium", freq: 65, tags: [] },
    { id: 1326, t: "Minimum Number of Taps to Open to Water a Garden", d: "Hard", freq: 51, tags: [] },
    { id: 127, t: "Word Ladder", d: "Hard", freq: 46, tags: [] },
    { id: 13, t: "Roman to Integer", d: "Easy", freq: 67, tags: [] },
    { id: 238, t: "Product of Array Except Self", d: "Medium", freq: 69, tags: [] },
    { id: 53, t: "Maximum Subarray", d: "Medium", freq: 53, tags: [] },
    { id: 3171, t: "Find Subarray With Bitwise OR Closest to K", d: "Hard", freq: 31, tags: [] },
    { id: 696, t: "Count Binary Substrings", d: "Easy", freq: 70, tags: [] },
    { id: 713, t: "Subarray Product Less Than K", d: "Medium", freq: 54, tags: [] },
    { id: 647, t: "Palindromic Substrings", d: "Medium", freq: 73, tags: [] },
    { id: 494, t: "Target Sum", d: "Medium", freq: 52, tags: [] },
    { id: 2484, t: "Count Palindromic Subsequences", d: "Hard", freq: 41, tags: [] },
    { id: 1315, t: "Sum of Nodes with Even-Valued Grandparent", d: "Medium", freq: 86, tags: [] },
    { id: 2068, t: "Check Whether Two Strings are Almost Equivalent", d: "Easy", freq: 64, tags: [] },
    { id: 3197, t: "Find the Minimum Area to Cover All Ones II", d: "Hard", freq: 64, tags: [] },
    { id: 3193, t: "Count the Number of Inversions", d: "Hard", freq: 31, tags: [] },
    { id: 3195, t: "Find the Minimum Area to Cover All Ones I", d: "Medium", freq: 78, tags: [] },
    { id: 895, t: "Maximum Frequency Stack", d: "Hard", freq: 67, tags: [] },
    { id: 2866, t: "Beautiful Towers II", d: "Medium", freq: 37, tags: [] },
    { id: 2865, t: "Beautiful Towers I", d: "Medium", freq: 45, tags: [] },
    { id: 2563, t: "Count the Number of Fair Pairs", d: "Medium", freq: 53, tags: [] },
    { id: 1701, t: "Average Waiting Time", d: "Medium", freq: 73, tags: [] },
    { id: 3125, t: "Maximum Number That Makes Result of Bitwise AND Zero", d: "Medium", freq: 70, tags: [] },
    { id: 1150, t: "Check If a Number Is Majority Element in a Sorted Array", d: "Easy", freq: 60, tags: [] },
    { id: 2946, t: "Matrix Similarity After Cyclic Shifts", d: "Easy", freq: 74, tags: [] },
    { id: 3200, t: "Maximum Height of a Triangle", d: "Easy", freq: 44, tags: [] },
    { id: 1051, t: "Height Checker", d: "Easy", freq: 82, tags: [] },
    { id: 1659, t: "Maximize Grid Happiness", d: "Hard", freq: 41, tags: [] },
    { id: 3135, t: "Equalize Strings by Adding or Removing Characters at Ends", d: "Medium", freq: 56, tags: [] },
    { id: 2992, t: "Number of Self-Divisible Permutations", d: "Medium", freq: 72, tags: [] },
    { id: 2957, t: "Remove Adjacent Almost-Equal Characters", d: "Medium", freq: 54, tags: [] },
    { id: 831, t: "Masking Personal Information", d: "Medium", freq: 55, tags: [] },
    { id: 152, t: "Maximum Product Subarray", d: "Medium", freq: 37, tags: [] },
    { id: 2966, t: "Divide Array Into Arrays With Max Difference", d: "Medium", freq: 79, tags: [] },
    { id: 233, t: "Number of Digit One", d: "Hard", freq: 39, tags: [] },
    { id: 1, t: "Two Sum", d: "Easy", freq: 58, tags: [] },
    { id: 1552, t: "Magnetic Force Between Two Balls", d: "Medium", freq: 72, tags: [] },
    { id: 4, t: "Median of Two Sorted Arrays", d: "Hard", freq: 47, tags: [] },
    { id: 924, t: "Minimize Malware Spread", d: "Hard", freq: 43, tags: [] },
    { id: 2025, t: "Maximum Number of Ways to Partition an Array", d: "Hard", freq: 36, tags: [] },
    { id: 1710, t: "Maximum Units on a Truck", d: "Easy", freq: 75, tags: [] },
    { id: 2231, t: "Largest Number After Digit Swaps by Parity", d: "Easy", freq: 65, tags: [] },
    { id: 394, t: "Decode String", d: "Medium", freq: 63, tags: [] },
    { id: 2964, t: "Number of Divisible Triplet Sums", d: "Medium", freq: 68, tags: [] },
    { id: 79, t: "Word Search", d: "Medium", freq: 48, tags: [] },
    { id: 692, t: "Top K Frequent Words", d: "Medium", freq: 60, tags: [] },
    { id: 1297, t: "Maximum Number of Occurrences of a Substring", d: "Medium", freq: 55, tags: [] },
    { id: 532, t: "K-diff Pairs in an Array", d: "Medium", freq: 46, tags: [] },
    { id: 255, t: "Verify Preorder Sequence in Binary Search Tree", d: "Medium", freq: 52, tags: [] },
    { id: 25, t: "Reverse Nodes in k-Group", d: "Hard", freq: 66, tags: [] },
    { id: 366, t: "Find Leaves of Binary Tree", d: "Medium", freq: 81, tags: [] },
    { id: 329, t: "Longest Increasing Path in a Matrix", d: "Hard", freq: 57, tags: [] },
    { id: 224, t: "Basic Calculator", d: "Hard", freq: 47, tags: [] },
    { id: 973, t: "K Closest Points to Origin", d: "Medium", freq: 69, tags: [] },
    { id: 1200, t: "Minimum Absolute Difference", d: "Easy", freq: 75, tags: [] },
    { id: 636, t: "Exclusive Time of Functions", d: "Medium", freq: 66, tags: [] },
    { id: 134, t: "Gas Station", d: "Medium", freq: 48, tags: [] },
    { id: 2515, t: "Shortest Distance to Target String in a Circular Array", d: "Easy", freq: 65, tags: [] },
    { id: 300, t: "Longest Increasing Subsequence", d: "Medium", freq: 60, tags: [] },
    { id: 443, t: "String Compression", d: "Medium", freq: 60, tags: [] },
    { id: 6, t: "Zigzag Conversion", d: "Medium", freq: 54, tags: [] },
    { id: 863, t: "All Nodes Distance K in Binary Tree", d: "Medium", freq: 68, tags: [] },
    { id: 289, t: "Game of Life", d: "Medium", freq: 73, tags: [] },
    { id: 3398, t: "Smallest Substring With Identical Characters I", d: "Hard", freq: 21, tags: [] },
    { id: 3399, t: "Smallest Substring With Identical Characters II", d: "Hard", freq: 40, tags: [] },
    { id: 2008, t: "Maximum Earnings From Taxi", d: "Medium", freq: 47, tags: [] },
    { id: 23, t: "Merge k Sorted Lists", d: "Hard", freq: 60, tags: [] },
    { id: 1944, t: "Number of Visible People in a Queue", d: "Hard", freq: 73, tags: [] },
    { id: 2472, t: "Maximum Number of Non-overlapping Palindrome Substrings", d: "Hard", freq: 45, tags: [] },
    { id: 437, t: "Path Sum III", d: "Medium", freq: 46, tags: [] },
    { id: 1004, t: "Max Consecutive Ones III", d: "Medium", freq: 68, tags: [] },
    { id: 1335, t: "Minimum Difficulty of a Job Schedule", d: "Hard", freq: 60, tags: [] },
    { id: 135, t: "Candy", d: "Hard", freq: 49, tags: [] },
    { id: 2918, t: "Minimum Equal Sum of Two Arrays After Replacing Zeros", d: "Medium", freq: 50, tags: [] },
    { id: 844, t: "Backspace String Compare", d: "Easy", freq: 50, tags: [] },
    { id: 875, t: "Koko Eating Bananas", d: "Medium", freq: 50, tags: [] },
    { id: 1221, t: "Split a String in Balanced Strings", d: "Easy", freq: 87, tags: [] },
    { id: 2451, t: "Odd String Difference", d: "Easy", freq: 62, tags: [] },
    { id: 1481, t: "Least Number of Unique Integers after K Removals", d: "Medium", freq: 64, tags: [] },
    { id: 3488, t: "Closest Equal Element Queries", d: "Medium", freq: 51, tags: [] },
    { id: 2345, t: "Finding the Number of Visible Mountains", d: "Medium", freq: 37, tags: [] },
    { id: 2571, t: "Minimum Operations to Reduce an Integer to 0", d: "Medium", freq: 63, tags: [] },
    { id: 1143, t: "Longest Common Subsequence", d: "Medium", freq: 59, tags: [] },
    { id: 3540, t: "Minimum Time to Visit All Houses", d: "Medium", freq: 69, tags: [] },
    { id: 353, t: "Design Snake Game", d: "Medium", freq: 40, tags: [] },
    { id: 41, t: "First Missing Positive", d: "Hard", freq: 43, tags: [] },
    { id: 724, t: "Find Pivot Index", d: "Easy", freq: 63, tags: [] },
    { id: 2488, t: "Count Subarrays With Median K", d: "Hard", freq: 49, tags: [] },
    { id: 465, t: "Optimal Account Balancing", d: "Hard", freq: 51, tags: [] },
    { id: 3295, t: "Report Spam Message", d: "Medium", freq: 49, tags: [] },
    { id: 535, t: "Encode and Decode TinyURL", d: "Medium", freq: 87, tags: [] },
    { id: 21, t: "Merge Two Sorted Lists", d: "Easy", freq: 68, tags: [] },
    { id: 1438, t: "Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit", d: "Medium", freq: 58, tags: [] },
    { id: 239, t: "Sliding Window Maximum", d: "Hard", freq: 49, tags: [] },
    { id: 125, t: "Valid Palindrome", d: "Easy", freq: 53, tags: [] },
    { id: 894, t: "All Possible Full Binary Trees", d: "Medium", freq: 83, tags: [] },
    { id: 75, t: "Sort Colors", d: "Medium", freq: 70, tags: [] },
    { id: 3607, t: "Power Grid Maintenance", d: "Medium", freq: 56, tags: [] },
    { id: 2434, t: "Using a Robot to Print the Lexicographically Smallest String", d: "Medium", freq: 62, tags: [] },
    { id: 3170, t: "Lexicographically Minimum String After Removing Stars", d: "Medium", freq: 51, tags: [] },
    { id: 545, t: "Boundary of Binary Tree", d: "Medium", freq: 48, tags: [] },
    { id: 768, t: "Max Chunks To Make Sorted II", d: "Hard", freq: 55, tags: [] },
    { id: 3613, t: "Minimize Maximum Component Cost", d: "Medium", freq: 44, tags: [] },
    { id: 20, t: "Valid Parentheses", d: "Easy", freq: 44, tags: [] },
    { id: 740, t: "Delete and Earn", d: "Medium", freq: 57, tags: [] },
    { id: 815, t: "Bus Routes", d: "Hard", freq: 47, tags: [] },
    { id: 85, t: "Maximal Rectangle", d: "Hard", freq: 59, tags: [] },
    { id: 767, t: "Reorganize String", d: "Medium", freq: 57, tags: [] },
    { id: 337, t: "House Robber III", d: "Medium", freq: 56, tags: [] },
    { id: 1319, t: "Number of Operations to Make Network Connected", d: "Medium", freq: 67, tags: [] },
    { id: 703, t: "Kth Largest Element in a Stream", d: "Easy", freq: 61, tags: [] },
    { id: 630, t: "Course Schedule III", d: "Hard", freq: 42, tags: [] },
    { id: 992, t: "Subarrays with K Different Integers", d: "Hard", freq: 68, tags: [] },
    { id: 652, t: "Find Duplicate Subtrees", d: "Medium", freq: 61, tags: [] },
    { id: 1209, t: "Remove All Adjacent Duplicates in String II", d: "Medium", freq: 61, tags: [] },
    { id: 743, t: "Network Delay Time", d: "Medium", freq: 61, tags: [] },
    { id: 287, t: "Find the Duplicate Number", d: "Medium", freq: 64, tags: [] },
    { id: 332, t: "Reconstruct Itinerary", d: "Hard", freq: 45, tags: [] },
    { id: 268, t: "Missing Number", d: "Easy", freq: 72, tags: [] },
    { id: 727, t: "Minimum Window Subsequence", d: "Hard", freq: 44, tags: [] },
    { id: 213, t: "House Robber II", d: "Medium", freq: 45, tags: [] },
    { id: 2380, t: "Time Needed to Rearrange a Binary String", d: "Medium", freq: 53, tags: [] },
    { id: 994, t: "Rotting Oranges", d: "Medium", freq: 59, tags: [] },
  ],
  "Goldman Sachs": [
    { id: 545, t: "Boundary of Binary Tree", d: "Medium", freq: 48, tags: [] },
    { id: 588, t: "Design In-Memory File System", d: "Hard", freq: 48, tags: [] },
    { id: 116, t: "Populating Next Right Pointers in Each Node", d: "Medium", freq: 67, tags: [] },
    { id: 117, t: "Populating Next Right Pointers in Each Node II", d: "Medium", freq: 58, tags: [] },
    { id: 2050, t: "Parallel Courses III", d: "Hard", freq: 67, tags: [] },
    { id: 1639, t: "Number of Ways to Form a Target String Given a Dictionary", d: "Hard", freq: 57, tags: [] },
    { id: 224, t: "Basic Calculator", d: "Hard", freq: 47, tags: [] },
    { id: 227, t: "Basic Calculator II", d: "Medium", freq: 47, tags: [] },
    { id: 2742, t: "Painting the Walls", d: "Hard", freq: 49, tags: [] },
    { id: 1235, t: "Maximum Profit in Job Scheduling", d: "Hard", freq: 55, tags: [] },
    { id: 2303, t: "Calculate Amount Paid in Taxes", d: "Easy", freq: 69, tags: [] },
    { id: 438, t: "Find All Anagrams in a String", d: "Medium", freq: 54, tags: [] },
    { id: 2851, t: "String Transformation", d: "Hard", freq: 27, tags: [] },
    { id: 212, t: "Word Search II", d: "Hard", freq: 39, tags: [] },
    { id: 273, t: "Integer to English Words", d: "Hard", freq: 35, tags: [] },
    { id: 146, t: "LRU Cache", d: "Medium", freq: 48, tags: [] },
    { id: 10, t: "Regular Expression Matching", d: "Hard", freq: 31, tags: [] },
    { id: 362, t: "Design Hit Counter", d: "Medium", freq: 70, tags: [] },
    { id: 202, t: "Happy Number", d: "Easy", freq: 60, tags: [] },
    { id: 210, t: "Course Schedule II", d: "Medium", freq: 56, tags: [] },
    { id: 981, t: "Time Based Key-Value Store", d: "Medium", freq: 50, tags: [] },
    { id: 155, t: "Min Stack", d: "Medium", freq: 58, tags: [] },
    { id: 3176, t: "Find the Maximum Length of a Good Subsequence I", d: "Medium", freq: 33, tags: [] },
    { id: 2856, t: "Minimum Array Length After Pair Removals", d: "Medium", freq: 28, tags: [] },
    { id: 3155, t: "Maximum Number of Upgradable Servers", d: "Medium", freq: 44, tags: [] },
    { id: 3177, t: "Find the Maximum Length of a Good Subsequence II", d: "Hard", freq: 25, tags: [] },
    { id: 706, t: "Design HashMap", d: "Easy", freq: 67, tags: [] },
    { id: 1898, t: "Maximum Number of Removable Characters", d: "Medium", freq: 47, tags: [] },
    { id: 528, t: "Random Pick with Weight", d: "Medium", freq: 49, tags: [] },
    { id: 42, t: "Trapping Rain Water", d: "Hard", freq: 68, tags: [] },
    { id: 872, t: "Leaf-Similar Trees", d: "Easy", freq: 70, tags: [] },
    { id: 76, t: "Minimum Window Substring", d: "Hard", freq: 48, tags: [] },
    { id: 11, t: "Container With Most Water", d: "Medium", freq: 60, tags: [] },
    { id: 2062, t: "Count Vowel Substrings of a String", d: "Easy", freq: 73, tags: [] },
    { id: 207, t: "Course Schedule", d: "Medium", freq: 52, tags: [] },
    { id: 380, t: "Insert Delete GetRandom O(1)", d: "Medium", freq: 55, tags: [] },
    { id: 295, t: "Find Median from Data Stream", d: "Hard", freq: 55, tags: [] },
    { id: 23, t: "Merge k Sorted Lists", d: "Hard", freq: 60, tags: [] },
    { id: 105, t: "Construct Binary Tree from Preorder and Inorder Traversal", d: "Medium", freq: 69, tags: [] },
    { id: 138, t: "Copy List with Random Pointer", d: "Medium", freq: 63, tags: [] },
    { id: 121, t: "Best Time to Buy and Sell Stock", d: "Easy", freq: 57, tags: [] },
    { id: 21, t: "Merge Two Sorted Lists", d: "Easy", freq: 68, tags: [] },
    { id: 2467, t: "Most Profitable Path in a Tree", d: "Medium", freq: 67, tags: [] },
    { id: 52, t: "N-Queens II", d: "Hard", freq: 79, tags: [] },
    { id: 849, t: "Maximize Distance to Closest Person", d: "Medium", freq: 50, tags: [] },
    { id: 687, t: "Longest Univalue Path", d: "Medium", freq: 44, tags: [] },
    { id: 1600, t: "Throne Inheritance", d: "Medium", freq: 67, tags: [] },
    { id: 408, t: "Valid Word Abbreviation", d: "Easy", freq: 37, tags: [] },
    { id: 208, t: "Implement Trie (Prefix Tree)", d: "Medium", freq: 70, tags: [] },
    { id: 695, t: "Max Area of Island", d: "Medium", freq: 74, tags: [] },
    { id: 1, t: "Two Sum", d: "Easy", freq: 58, tags: [] },
    { id: 540, t: "Single Element in a Sorted Array", d: "Medium", freq: 59, tags: [] },
    { id: 621, t: "Task Scheduler", d: "Medium", freq: 63, tags: [] },
    { id: 1353, t: "Maximum Number of Events That Can Be Attended", d: "Medium", freq: 39, tags: [] },
    { id: 286, t: "Walls and Gates", d: "Medium", freq: 64, tags: [] },
    { id: 347, t: "Top K Frequent Elements", d: "Medium", freq: 67, tags: [] },
    { id: 1631, t: "Path With Minimum Effort", d: "Medium", freq: 63, tags: [] },
    { id: 1233, t: "Remove Sub-Folders from the Filesystem", d: "Medium", freq: 79, tags: [] },
    { id: 2096, t: "Step-By-Step Directions From a Binary Tree Node to Another", d: "Medium", freq: 56, tags: [] },
    { id: 402, t: "Remove K Digits", d: "Medium", freq: 37, tags: [] },
    { id: 13, t: "Roman to Integer", d: "Easy", freq: 67, tags: [] },
    { id: 71, t: "Simplify Path", d: "Medium", freq: 51, tags: [] },
    { id: 435, t: "Non-overlapping Intervals", d: "Medium", freq: 57, tags: [] },
    { id: 827, t: "Making A Large Island", d: "Hard", freq: 57, tags: [] },
    { id: 1136, t: "Parallel Courses", d: "Medium", freq: 62, tags: [] },
    { id: 917, t: "Reverse Only Letters", d: "Easy", freq: 69, tags: [] },
    { id: 947, t: "Most Stones Removed with Same Row or Column", d: "Medium", freq: 63, tags: [] },
    { id: 841, t: "Keys and Rooms", d: "Medium", freq: 76, tags: [] },
    { id: 1242, t: "Web Crawler Multithreaded", d: "Medium", freq: 51, tags: [] },
    { id: 1751, t: "Maximum Number of Events That Can Be Attended II", d: "Hard", freq: 64, tags: [] },
    { id: 635, t: "Design Log Storage System", d: "Medium", freq: 60, tags: [] },
    { id: 211, t: "Design Add and Search Words Data Structure", d: "Medium", freq: 49, tags: [] },
    { id: 881, t: "Boats to Save People", d: "Medium", freq: 62, tags: [] },
    { id: 1146, t: "Snapshot Array", d: "Medium", freq: 37, tags: [] },
    { id: 1604, t: "Alert Using Same Key-Card Three or More Times in a One Hour Period", d: "Medium", freq: 46, tags: [] },
    { id: 79, t: "Word Search", d: "Medium", freq: 48, tags: [] },
    { id: 729, t: "My Calendar I", d: "Medium", freq: 58, tags: [] },
    { id: 787, t: "Cheapest Flights Within K Stops", d: "Medium", freq: 42, tags: [] },
    { id: 1236, t: "Web Crawler", d: "Medium", freq: 69, tags: [] },
    { id: 622, t: "Design Circular Queue", d: "Medium", freq: 55, tags: [] },
    { id: 253, t: "Meeting Rooms II", d: "Medium", freq: 53, tags: [] },
    { id: 276, t: "Paint Fence", d: "Medium", freq: 48, tags: [] },
    { id: 1166, t: "Design File System", d: "Medium", freq: 65, tags: [] },
    { id: 994, t: "Rotting Oranges", d: "Medium", freq: 59, tags: [] },
    { id: 1494, t: "Parallel Courses II", d: "Hard", freq: 31, tags: [] },
    { id: 271, t: "Encode and Decode Strings", d: "Medium", freq: 52, tags: [] },
    { id: 2, t: "Add Two Numbers", d: "Medium", freq: 49, tags: [] },
  ],
  Citadel: [
    { id: 23, t: "Merge k Sorted Lists", d: "Hard", freq: 60, tags: [] },
    { id: 37, t: "Sudoku Solver", d: "Hard", freq: 65, tags: [] },
    { id: 121, t: "Best Time to Buy and Sell Stock", d: "Easy", freq: 57, tags: [] },
    { id: 123, t: "Best Time to Buy and Sell Stock III", d: "Hard", freq: 54, tags: [] },
    { id: 124, t: "Binary Tree Maximum Path Sum", d: "Hard", freq: 42, tags: [] },
    { id: 146, t: "LRU Cache", d: "Medium", freq: 48, tags: [] },
    { id: 150, t: "Evaluate Reverse Polish Notation", d: "Medium", freq: 58, tags: [] },
    { id: 221, t: "Maximal Square", d: "Medium", freq: 50, tags: [] },
    { id: 239, t: "Sliding Window Maximum", d: "Hard", freq: 49, tags: [] },
    { id: 287, t: "Find the Duplicate Number", d: "Medium", freq: 64, tags: [] },
    { id: 297, t: "Serialize and Deserialize Binary Tree", d: "Hard", freq: 61, tags: [] },
    { id: 380, t: "Insert Delete GetRandom O(1)", d: "Medium", freq: 55, tags: [] },
    { id: 2361, t: "Minimum Costs Using the Train Line", d: "Hard", freq: 78, tags: [] },
    { id: 460, t: "LFU Cache", d: "Hard", freq: 49, tags: [] },
    { id: 647, t: "Palindromic Substrings", d: "Medium", freq: 73, tags: [] },
    { id: 200, t: "Number of Islands", d: "Medium", freq: 65, tags: [] },
    { id: 295, t: "Find Median from Data Stream", d: "Hard", freq: 55, tags: [] },
    { id: 399, t: "Evaluate Division", d: "Medium", freq: 64, tags: [] },
    { id: 49, t: "Group Anagrams", d: "Medium", freq: 73, tags: [] },
    { id: 1268, t: "Search Suggestions System", d: "Medium", freq: 65, tags: [] },
    { id: 1048, t: "Longest String Chain", d: "Medium", freq: 63, tags: [] },
    { id: 39, t: "Combination Sum", d: "Medium", freq: 77, tags: [] },
    { id: 2702, t: "Minimum Operations to Make Numbers Non-positive", d: "Hard", freq: 44, tags: [] },
    { id: 2050, t: "Parallel Courses III", d: "Hard", freq: 67, tags: [] },
    { id: 1515, t: "Best Position for a Service Centre", d: "Hard", freq: 35, tags: [] },
    { id: 2661, t: "First Completely Painted Row or Column", d: "Medium", freq: 64, tags: [] },
    { id: 3186, t: "Maximum Total Damage With Spell Casting", d: "Medium", freq: 45, tags: [] },
    { id: 718, t: "Maximum Length of Repeated Subarray", d: "Medium", freq: 51, tags: [] },
    { id: 2958, t: "Length of Longest Subarray With at Most K Frequency", d: "Medium", freq: 57, tags: [] },
    { id: 765, t: "Couples Holding Hands", d: "Hard", freq: 59, tags: [] },
    { id: 208, t: "Implement Trie (Prefix Tree)", d: "Medium", freq: 70, tags: [] },
    { id: 279, t: "Perfect Squares", d: "Medium", freq: 57, tags: [] },
    { id: 622, t: "Design Circular Queue", d: "Medium", freq: 55, tags: [] },
    { id: 412, t: "Fizz Buzz", d: "Easy", freq: 76, tags: [] },
    { id: 346, t: "Moving Average from Data Stream", d: "Easy", freq: 80, tags: [] },
    { id: 631, t: "Design Excel Sum Formula", d: "Hard", freq: 40, tags: [] },
    { id: 207, t: "Course Schedule", d: "Medium", freq: 52, tags: [] },
    { id: 767, t: "Reorganize String", d: "Medium", freq: 57, tags: [] },
    { id: 1670, t: "Design Front Middle Back Queue", d: "Medium", freq: 58, tags: [] },
    { id: 17, t: "Letter Combinations of a Phone Number", d: "Medium", freq: 66, tags: [] },
    { id: 126, t: "Word Ladder II", d: "Hard", freq: 28, tags: [] },
    { id: 1203, t: "Sort Items by Groups Respecting Dependencies", d: "Hard", freq: 66, tags: [] },
    { id: 2044, t: "Count Number of Maximum Bitwise-OR Subsets", d: "Medium", freq: 90, tags: [] },
    { id: 69, t: "Sqrt(x)", d: "Easy", freq: 42, tags: [] },
    { id: 70, t: "Climbing Stairs", d: "Easy", freq: 54, tags: [] },
    { id: 256, t: "Paint House", d: "Medium", freq: 65, tags: [] },
    { id: 149, t: "Max Points on a Line", d: "Hard", freq: 31, tags: [] },
    { id: 50, t: "Pow(x, n)", d: "Medium", freq: 39, tags: [] },
    { id: 1632, t: "Rank Transform of a Matrix", d: "Hard", freq: 42, tags: [] },
    { id: 56, t: "Merge Intervals", d: "Medium", freq: 52, tags: [] },
    { id: 103, t: "Binary Tree Zigzag Level Order Traversal", d: "Medium", freq: 64, tags: [] },
    { id: 2484, t: "Count Palindromic Subsequences", d: "Hard", freq: 41, tags: [] },
    { id: 1010, t: "Pairs of Songs With Total Durations Divisible by 60", d: "Medium", freq: 54, tags: [] },
    { id: 875, t: "Koko Eating Bananas", d: "Medium", freq: 50, tags: [] },
    { id: 204, t: "Count Primes", d: "Medium", freq: 36, tags: [] },
    { id: 759, t: "Employee Free Time", d: "Hard", freq: 73, tags: [] },
    { id: 34, t: "Find First and Last Position of Element in Sorted Array", d: "Medium", freq: 49, tags: [] },
    { id: 1229, t: "Meeting Scheduler", d: "Medium", freq: 55, tags: [] },
    { id: 1606, t: "Find Servers That Handled Most Number of Requests", d: "Hard", freq: 46, tags: [] },
    { id: 1801, t: "Number of Orders in the Backlog", d: "Medium", freq: 54, tags: [] },
    { id: 332, t: "Reconstruct Itinerary", d: "Hard", freq: 45, tags: [] },
    { id: 79, t: "Word Search", d: "Medium", freq: 48, tags: [] },
    { id: 210, t: "Course Schedule II", d: "Medium", freq: 56, tags: [] },
    { id: 1004, t: "Max Consecutive Ones III", d: "Medium", freq: 68, tags: [] },
    { id: 253, t: "Meeting Rooms II", d: "Medium", freq: 53, tags: [] },
    { id: 5, t: "Longest Palindromic Substring", d: "Medium", freq: 38, tags: [] },
    { id: 2598, t: "Smallest Missing Non-negative Integer After Operations", d: "Medium", freq: 56, tags: [] },
    { id: 31, t: "Next Permutation", d: "Medium", freq: 45, tags: [] },
    { id: 46, t: "Permutations", d: "Medium", freq: 82, tags: [] },
    { id: 98, t: "Validate Binary Search Tree", d: "Medium", freq: 36, tags: [] },
    { id: 1461, t: "Reverse Words in a String", d: "Medium", freq: 57, tags: [] },
    { id: 1155, t: "Number of Dice Rolls With Target Sum", d: "Medium", freq: 62, tags: [] },
    { id: 981, t: "Time Based Key-Value Store", d: "Medium", freq: 50, tags: [] },
    { id: 127, t: "Word Ladder", d: "Hard", freq: 46, tags: [] },
    { id: 188, t: "Best Time to Buy and Sell Stock IV", d: "Hard", freq: 50, tags: [] },
    { id: 348, t: "Design Tic-Tac-Toe", d: "Medium", freq: 59, tags: [] },
  ],
  Snowflake: [
    { id: 545, t: "Boundary of Binary Tree", d: "Medium", freq: 48, tags: [] },
    { id: 588, t: "Design In-Memory File System", d: "Hard", freq: 48, tags: [] },
    { id: 116, t: "Populating Next Right Pointers in Each Node", d: "Medium", freq: 67, tags: [] },
    { id: 117, t: "Populating Next Right Pointers in Each Node II", d: "Medium", freq: 58, tags: [] },
    { id: 2050, t: "Parallel Courses III", d: "Hard", freq: 67, tags: [] },
    { id: 1639, t: "Number of Ways to Form a Target String Given a Dictionary", d: "Hard", freq: 57, tags: [] },
    { id: 224, t: "Basic Calculator", d: "Hard", freq: 47, tags: [] },
    { id: 227, t: "Basic Calculator II", d: "Medium", freq: 47, tags: [] },
    { id: 2742, t: "Painting the Walls", d: "Hard", freq: 49, tags: [] },
    { id: 1235, t: "Maximum Profit in Job Scheduling", d: "Hard", freq: 55, tags: [] },
    { id: 2303, t: "Calculate Amount Paid in Taxes", d: "Easy", freq: 69, tags: [] },
    { id: 438, t: "Find All Anagrams in a String", d: "Medium", freq: 54, tags: [] },
    { id: 2851, t: "String Transformation", d: "Hard", freq: 27, tags: [] },
    { id: 212, t: "Word Search II", d: "Hard", freq: 39, tags: [] },
    { id: 273, t: "Integer to English Words", d: "Hard", freq: 35, tags: [] },
    { id: 146, t: "LRU Cache", d: "Medium", freq: 48, tags: [] },
    { id: 10, t: "Regular Expression Matching", d: "Hard", freq: 31, tags: [] },
    { id: 362, t: "Design Hit Counter", d: "Medium", freq: 70, tags: [] },
    { id: 202, t: "Happy Number", d: "Easy", freq: 60, tags: [] },
    { id: 210, t: "Course Schedule II", d: "Medium", freq: 56, tags: [] },
    { id: 981, t: "Time Based Key-Value Store", d: "Medium", freq: 50, tags: [] },
    { id: 155, t: "Min Stack", d: "Medium", freq: 58, tags: [] },
    { id: 3176, t: "Find the Maximum Length of a Good Subsequence I", d: "Medium", freq: 33, tags: [] },
    { id: 2856, t: "Minimum Array Length After Pair Removals", d: "Medium", freq: 28, tags: [] },
    { id: 3155, t: "Maximum Number of Upgradable Servers", d: "Medium", freq: 44, tags: [] },
    { id: 3177, t: "Find the Maximum Length of a Good Subsequence II", d: "Hard", freq: 25, tags: [] },
    { id: 706, t: "Design HashMap", d: "Easy", freq: 67, tags: [] },
    { id: 1898, t: "Maximum Number of Removable Characters", d: "Medium", freq: 47, tags: [] },
    { id: 528, t: "Random Pick with Weight", d: "Medium", freq: 49, tags: [] },
    { id: 42, t: "Trapping Rain Water", d: "Hard", freq: 68, tags: [] },
    { id: 872, t: "Leaf-Similar Trees", d: "Easy", freq: 70, tags: [] },
    { id: 76, t: "Minimum Window Substring", d: "Hard", freq: 48, tags: [] },
    { id: 11, t: "Container With Most Water", d: "Medium", freq: 60, tags: [] },
    { id: 2062, t: "Count Vowel Substrings of a String", d: "Easy", freq: 73, tags: [] },
    { id: 207, t: "Course Schedule", d: "Medium", freq: 52, tags: [] },
    { id: 380, t: "Insert Delete GetRandom O(1)", d: "Medium", freq: 55, tags: [] },
    { id: 295, t: "Find Median from Data Stream", d: "Hard", freq: 55, tags: [] },
    { id: 23, t: "Merge k Sorted Lists", d: "Hard", freq: 60, tags: [] },
    { id: 105, t: "Construct Binary Tree from Preorder and Inorder Traversal", d: "Medium", freq: 69, tags: [] },
    { id: 138, t: "Copy List with Random Pointer", d: "Medium", freq: 63, tags: [] },
    { id: 121, t: "Best Time to Buy and Sell Stock", d: "Easy", freq: 57, tags: [] },
    { id: 21, t: "Merge Two Sorted Lists", d: "Easy", freq: 68, tags: [] },
    { id: 2467, t: "Most Profitable Path in a Tree", d: "Medium", freq: 67, tags: [] },
    { id: 52, t: "N-Queens II", d: "Hard", freq: 79, tags: [] },
    { id: 849, t: "Maximize Distance to Closest Person", d: "Medium", freq: 50, tags: [] },
    { id: 687, t: "Longest Univalue Path", d: "Medium", freq: 44, tags: [] },
    { id: 1600, t: "Throne Inheritance", d: "Medium", freq: 67, tags: [] },
    { id: 408, t: "Valid Word Abbreviation", d: "Easy", freq: 37, tags: [] },
    { id: 208, t: "Implement Trie (Prefix Tree)", d: "Medium", freq: 70, tags: [] },
    { id: 695, t: "Max Area of Island", d: "Medium", freq: 74, tags: [] },
    { id: 1, t: "Two Sum", d: "Easy", freq: 58, tags: [] },
    { id: 540, t: "Single Element in a Sorted Array", d: "Medium", freq: 59, tags: [] },
    { id: 621, t: "Task Scheduler", d: "Medium", freq: 63, tags: [] },
    { id: 1353, t: "Maximum Number of Events That Can Be Attended", d: "Medium", freq: 39, tags: [] },
    { id: 286, t: "Walls and Gates", d: "Medium", freq: 64, tags: [] },
    { id: 347, t: "Top K Frequent Elements", d: "Medium", freq: 67, tags: [] },
    { id: 1631, t: "Path With Minimum Effort", d: "Medium", freq: 63, tags: [] },
    { id: 1233, t: "Remove Sub-Folders from the Filesystem", d: "Medium", freq: 79, tags: [] },
    { id: 2096, t: "Step-By-Step Directions From a Binary Tree Node to Another", d: "Medium", freq: 56, tags: [] },
    { id: 402, t: "Remove K Digits", d: "Medium", freq: 37, tags: [] },
    { id: 13, t: "Roman to Integer", d: "Easy", freq: 67, tags: [] },
    { id: 71, t: "Simplify Path", d: "Medium", freq: 51, tags: [] },
    { id: 435, t: "Non-overlapping Intervals", d: "Medium", freq: 57, tags: [] },
    { id: 827, t: "Making A Large Island", d: "Hard", freq: 57, tags: [] },
    { id: 1136, t: "Parallel Courses", d: "Medium", freq: 62, tags: [] },
    { id: 917, t: "Reverse Only Letters", d: "Easy", freq: 69, tags: [] },
    { id: 947, t: "Most Stones Removed with Same Row or Column", d: "Medium", freq: 63, tags: [] },
    { id: 841, t: "Keys and Rooms", d: "Medium", freq: 76, tags: [] },
    { id: 1242, t: "Web Crawler Multithreaded", d: "Medium", freq: 51, tags: [] },
    { id: 1751, t: "Maximum Number of Events That Can Be Attended II", d: "Hard", freq: 64, tags: [] },
    { id: 635, t: "Design Log Storage System", d: "Medium", freq: 60, tags: [] },
    { id: 211, t: "Design Add and Search Words Data Structure", d: "Medium", freq: 49, tags: [] },
    { id: 881, t: "Boats to Save People", d: "Medium", freq: 62, tags: [] },
    { id: 1146, t: "Snapshot Array", d: "Medium", freq: 37, tags: [] },
    { id: 1604, t: "Alert Using Same Key-Card Three or More Times in a One Hour Period", d: "Medium", freq: 46, tags: [] },
    { id: 79, t: "Word Search", d: "Medium", freq: 48, tags: [] },
    { id: 729, t: "My Calendar I", d: "Medium", freq: 58, tags: [] },
    { id: 787, t: "Cheapest Flights Within K Stops", d: "Medium", freq: 42, tags: [] },
    { id: 1236, t: "Web Crawler", d: "Medium", freq: 69, tags: [] },
    { id: 622, t: "Design Circular Queue", d: "Medium", freq: 55, tags: [] },
    { id: 253, t: "Meeting Rooms II", d: "Medium", freq: 53, tags: [] },
    { id: 276, t: "Paint Fence", d: "Medium", freq: 48, tags: [] },
    { id: 1166, t: "Design File System", d: "Medium", freq: 65, tags: [] },
    { id: 994, t: "Rotting Oranges", d: "Medium", freq: 59, tags: [] },
    { id: 1494, t: "Parallel Courses II", d: "Hard", freq: 31, tags: [] },
    { id: 271, t: "Encode and Decode Strings", d: "Medium", freq: 52, tags: [] },
    { id: 2, t: "Add Two Numbers", d: "Medium", freq: 49, tags: [] },
  ],
  TCS: [
    { id: 1, t: "Two Sum", d: "Easy", freq: 58, tags: [] },
    { id: 9, t: "Palindrome Number", d: "Easy", freq: 61, tags: [] },
    { id: 5, t: "Longest Palindromic Substring", d: "Medium", freq: 38, tags: [] },
    { id: 169, t: "Majority Element", d: "Easy", freq: 66, tags: [] },
    { id: 53, t: "Maximum Subarray", d: "Medium", freq: 53, tags: [] },
    { id: 121, t: "Best Time to Buy and Sell Stock", d: "Easy", freq: 57, tags: [] },
    { id: 283, t: "Move Zeroes", d: "Easy", freq: 64, tags: [] },
    { id: 14, t: "Longest Common Prefix", d: "Easy", freq: 48, tags: [] },
    { id: 20, t: "Valid Parentheses", d: "Easy", freq: 44, tags: [] },
    { id: 176, t: "Second Highest Salary", d: "Medium", freq: 47, tags: [] },
    { id: 28, t: "Find the Index of the First Occurrence in a String", d: "Easy", freq: 47, tags: [] },
    { id: 75, t: "Sort Colors", d: "Medium", freq: 70, tags: [] },
    { id: 136, t: "Single Number", d: "Easy", freq: 78, tags: [] },
    { id: 4, t: "Median of Two Sorted Arrays", d: "Hard", freq: 47, tags: [] },
    { id: 55, t: "Jump Game", d: "Medium", freq: 41, tags: [] },
    { id: 242, t: "Valid Anagram", d: "Easy", freq: 68, tags: [] },
    { id: 560, t: "Subarray Sum Equals K", d: "Medium", freq: 47, tags: [] },
    { id: 1752, t: "Check if Array Is Sorted and Rotated", d: "Easy", freq: 57, tags: [] },
    { id: 3417, t: "Zigzag Grid Traversal With Skip", d: "Easy", freq: 65, tags: [] },
    { id: 3, t: "Longest Substring Without Repeating Characters", d: "Medium", freq: 39, tags: [] },
    { id: 7, t: "Reverse Integer", d: "Medium", freq: 32, tags: [] },
    { id: 15, t: "3Sum", d: "Medium", freq: 39, tags: [] },
    { id: 217, t: "Contains Duplicate", d: "Easy", freq: 64, tags: [] },
    { id: 11, t: "Container With Most Water", d: "Medium", freq: 60, tags: [] },
    { id: 26, t: "Remove Duplicates from Sorted Array", d: "Easy", freq: 63, tags: [] },
    { id: 42, t: "Trapping Rain Water", d: "Hard", freq: 68, tags: [] },
    { id: 50, t: "Pow(x, n)", d: "Medium", freq: 39, tags: [] },
    { id: 509, t: "Fibonacci Number", d: "Easy", freq: 74, tags: [] },
    { id: 621, t: "Task Scheduler", d: "Medium", freq: 63, tags: [] },
    { id: 898, t: "Bitwise ORs of Subarrays", d: "Medium", freq: 57, tags: [] },
    { id: 13, t: "Roman to Integer", d: "Easy", freq: 67, tags: [] },
    { id: 54, t: "Spiral Matrix", d: "Medium", freq: 57, tags: [] },
    { id: 56, t: "Merge Intervals", d: "Medium", freq: 52, tags: [] },
    { id: 62, t: "Unique Paths", d: "Medium", freq: 67, tags: [] },
    { id: 70, t: "Climbing Stairs", d: "Easy", freq: 54, tags: [] },
    { id: 189, t: "Rotate Array", d: "Medium", freq: 45, tags: [] },
    { id: 268, t: "Missing Number", d: "Easy", freq: 72, tags: [] },
    { id: 344, t: "Reverse String", d: "Easy", freq: 81, tags: [] },
    { id: 1125, t: "Smallest Sufficient Team", d: "Hard", freq: 56, tags: [] },
    { id: 19, t: "Remove Nth Node From End of List", d: "Medium", freq: 52, tags: [] },
    { id: 22, t: "Generate Parentheses", d: "Medium", freq: 79, tags: [] },
    { id: 31, t: "Next Permutation", d: "Medium", freq: 45, tags: [] },
    { id: 33, t: "Search in Rotated Sorted Array", d: "Medium", freq: 45, tags: [] },
    { id: 35, t: "Search Insert Position", d: "Easy", freq: 51, tags: [] },
    { id: 51, t: "N-Queens", d: "Hard", freq: 76, tags: [] },
    { id: 66, t: "Plus One", d: "Easy", freq: 50, tags: [] },
    { id: 67, t: "Add Binary", d: "Easy", freq: 58, tags: [] },
    { id: 88, t: "Merge Sorted Array", d: "Easy", freq: 55, tags: [] },
    { id: 125, t: "Valid Palindrome", d: "Easy", freq: 53, tags: [] },
    { id: 202, t: "Happy Number", d: "Easy", freq: 60, tags: [] },
    { id: 219, t: "Contains Duplicate II", d: "Easy", freq: 51, tags: [] },
    { id: 312, t: "Burst Balloons", d: "Hard", freq: 64, tags: [] },
    { id: 805, t: "Split Array With Same Average", d: "Hard", freq: 27, tags: [] },
    { id: 876, t: "Middle of the Linked List", d: "Easy", freq: 82, tags: [] },
    { id: 912, t: "Sort an Array", d: "Medium", freq: 56, tags: [] },
    { id: 2006, t: "Count Number of Pairs With Absolute Difference K", d: "Easy", freq: 85, tags: [] },
    { id: 18, t: "4Sum", d: "Medium", freq: 41, tags: [] },
    { id: 34, t: "Find First and Last Position of Element in Sorted Array", d: "Medium", freq: 49, tags: [] },
    { id: 49, t: "Group Anagrams", d: "Medium", freq: 73, tags: [] },
    { id: 69, t: "Sqrt(x)", d: "Easy", freq: 42, tags: [] },
    { id: 73, t: "Set Matrix Zeroes", d: "Medium", freq: 63, tags: [] },
    { id: 81, t: "Search in Rotated Sorted Array II", d: "Medium", freq: 40, tags: [] },
    { id: 118, t: "Pascal's Triangle", d: "Easy", freq: 79, tags: [] },
    { id: 151, t: "Reverse Words in a String", d: "Medium", freq: 57, tags: [] },
    { id: 152, t: "Maximum Product Subarray", d: "Medium", freq: 37, tags: [] },
    { id: 155, t: "Min Stack", d: "Medium", freq: 58, tags: [] },
    { id: 179, t: "Largest Number", d: "Medium", freq: 43, tags: [] },
    { id: 181, t: "Employees Earning More Than Their Managers", d: "Easy", freq: 73, tags: [] },
    { id: 239, t: "Sliding Window Maximum", d: "Hard", freq: 49, tags: [] },
    { id: 297, t: "Serialize and Deserialize Binary Tree", d: "Hard", freq: 61, tags: [] },
    { id: 387, t: "First Unique Character in a String", d: "Easy", freq: 66, tags: [] },
    { id: 416, t: "Partition Equal Subset Sum", d: "Medium", freq: 50, tags: [] },
    { id: 956, t: "Tallest Billboard", d: "Hard", freq: 52, tags: [] },
    { id: 1068, t: "Product Sales Analysis I", d: "Easy", freq: 86, tags: [] },
    { id: 2, t: "Add Two Numbers", d: "Medium", freq: 49, tags: [] },
    { id: 23, t: "Merge k Sorted Lists", d: "Hard", freq: 60, tags: [] },
    { id: 41, t: "First Missing Positive", d: "Hard", freq: 43, tags: [] },
    { id: 45, t: "Jump Game II", d: "Medium", freq: 43, tags: [] },
    { id: 58, t: "Length of Last Word", d: "Easy", freq: 59, tags: [] },
    { id: 85, t: "Maximal Rectangle", d: "Hard", freq: 59, tags: [] },
    { id: 128, t: "Longest Consecutive Sequence", d: "Medium", freq: 47, tags: [] },
    { id: 182, t: "Duplicate Emails", d: "Easy", freq: 74, tags: [] },
    { id: 185, t: "Department Top Three Salaries", d: "Hard", freq: 61, tags: [] },
    { id: 287, t: "Find the Duplicate Number", d: "Medium", freq: 64, tags: [] },
    { id: 412, t: "Fizz Buzz", d: "Easy", freq: 76, tags: [] },
    { id: 462, t: "Minimum Moves to Equal Array Elements II", d: "Medium", freq: 62, tags: [] },
    { id: 485, t: "Max Consecutive Ones", d: "Easy", freq: 65, tags: [] },
    { id: 532, t: "K-diff Pairs in an Array", d: "Medium", freq: 46, tags: [] },
    { id: 543, t: "Diameter of Binary Tree", d: "Easy", freq: 66, tags: [] },
    { id: 584, t: "Find Customer Referee", d: "Easy", freq: 73, tags: [] },
    { id: 628, t: "Maximum Product of Three Numbers", d: "Easy", freq: 46, tags: [] },
    { id: 875, t: "Koko Eating Bananas", d: "Medium", freq: 50, tags: [] },
    { id: 1075, t: "Project Employees I", d: "Easy", freq: 67, tags: [] },
    { id: 1148, t: "Article Views I", d: "Easy", freq: 77, tags: [] },
    { id: 1493, t: "Longest Subarray of 1's After Deleting One Element", d: "Medium", freq: 71, tags: [] },
    { id: 1518, t: "Water Bottles", d: "Easy", freq: 73, tags: [] },
    { id: 1757, t: "Recyclable and Low Fat Products", d: "Easy", freq: 89, tags: [] },
    { id: 1800, t: "Maximum Ascending Subarray Sum", d: "Easy", freq: 66, tags: [] },
    { id: 2095, t: "Delete the Middle Node of a Linked List", d: "Medium", freq: 60, tags: [] },
    { id: 2099, t: "Find Subsequence of Length K With the Largest Sum", d: "Easy", freq: 57, tags: [] },
    { id: 2423, t: "Remove Letter To Equalize Frequency", d: "Easy", freq: 19, tags: [] },
    { id: 2520, t: "Count the Digits That Divide a Number", d: "Easy", freq: 86, tags: [] },
    { id: 6, t: "Zigzag Conversion", d: "Medium", freq: 54, tags: [] },
    { id: 10, t: "Regular Expression Matching", d: "Hard", freq: 31, tags: [] },
    { id: 12, t: "Integer to Roman", d: "Medium", freq: 71, tags: [] },
    { id: 17, t: "Letter Combinations of a Phone Number", d: "Medium", freq: 66, tags: [] },
    { id: 21, t: "Merge Two Sorted Lists", d: "Easy", freq: 68, tags: [] },
    { id: 46, t: "Permutations", d: "Medium", freq: 82, tags: [] },
    { id: 48, t: "Rotate Image", d: "Medium", freq: 80, tags: [] },
    { id: 63, t: "Unique Paths II", d: "Medium", freq: 45, tags: [] },
    { id: 78, t: "Subsets", d: "Medium", freq: 82, tags: [] },
    { id: 80, t: "Remove Duplicates from Sorted Array II", d: "Medium", freq: 65, tags: [] },
    { id: 83, t: "Remove Duplicates from Sorted List", d: "Easy", freq: 57, tags: [] },
    { id: 94, t: "Binary Tree Inorder Traversal", d: "Easy", freq: 80, tags: [] },
    { id: 109, t: "Convert Sorted List to Binary Search Tree", d: "Medium", freq: 67, tags: [] },
    { id: 122, t: "Best Time to Buy and Sell Stock II", d: "Medium", freq: 71, tags: [] },
    { id: 124, t: "Binary Tree Maximum Path Sum", d: "Hard", freq: 42, tags: [] },
    { id: 141, t: "Linked List Cycle", d: "Easy", freq: 54, tags: [] },
    { id: 142, t: "Linked List Cycle II", d: "Medium", freq: 58, tags: [] },
    { id: 143, t: "Reorder List", d: "Medium", freq: 65, tags: [] },
    { id: 146, t: "LRU Cache", d: "Medium", freq: 48, tags: [] },
    { id: 153, t: "Find Minimum in Rotated Sorted Array", d: "Medium", freq: 55, tags: [] },
    { id: 164, t: "Maximum Gap", d: "Medium", freq: 52, tags: [] },
    { id: 184, t: "Department Highest Salary", d: "Medium", freq: 58, tags: [] },
    { id: 198, t: "House Robber", d: "Medium", freq: 53, tags: [] },
    { id: 200, t: "Number of Islands", d: "Medium", freq: 65, tags: [] },
    { id: 204, t: "Count Primes", d: "Medium", freq: 36, tags: [] },
    { id: 206, t: "Reverse Linked List", d: "Easy", freq: 81, tags: [] },
    { id: 209, t: "Minimum Size Subarray Sum", d: "Medium", freq: 52, tags: [] },
    { id: 229, t: "Majority Element II", d: "Medium", freq: 56, tags: [] },
    { id: 231, t: "Power of Two", d: "Easy", freq: 50, tags: [] },
    { id: 263, t: "Ugly Number", d: "Easy", freq: 44, tags: [] },
    { id: 273, t: "Integer to English Words", d: "Hard", freq: 35, tags: [] },
    { id: 303, t: "Range Sum Query - Immutable", d: "Easy", freq: 72, tags: [] },
    { id: 328, t: "Odd Even Linked List", d: "Medium", freq: 63, tags: [] },
    { id: 349, t: "Intersection of Two Arrays", d: "Easy", freq: 78, tags: [] },
    { id: 405, t: "Convert a Number to Hexadecimal", d: "Easy", freq: 54, tags: [] },
    { id: 414, t: "Third Maximum Number", d: "Easy", freq: 40, tags: [] },
    { id: 435, t: "Non-overlapping Intervals", d: "Medium", freq: 57, tags: [] },
    { id: 442, t: "Find All Duplicates in an Array", d: "Medium", freq: 77, tags: [] },
    { id: 443, t: "String Compression", d: "Medium", freq: 60, tags: [] },
    { id: 455, t: "Assign Cookies", d: "Easy", freq: 55, tags: [] },
    { id: 459, t: "Repeated Substring Pattern", d: "Easy", freq: 48, tags: [] },
    { id: 495, t: "Teemo Attacking", d: "Easy", freq: 58, tags: [] },
    { id: 516, t: "Longest Palindromic Subsequence", d: "Medium", freq: 66, tags: [] },
    { id: 523, t: "Continuous Subarray Sum", d: "Medium", freq: 31, tags: [] },
    { id: 567, t: "Permutation in String", d: "Medium", freq: 49, tags: [] },
    { id: 577, t: "Employee Bonus", d: "Easy", freq: 78, tags: [] },
    { id: 643, t: "Maximum Average Subarray I", d: "Easy", freq: 48, tags: [] },
    { id: 658, t: "Find K Closest Elements", d: "Medium", freq: 50, tags: [] },
    { id: 670, t: "Maximum Swap", d: "Medium", freq: 52, tags: [] },
    { id: 704, t: "Binary Search", d: "Easy", freq: 61, tags: [] },
    { id: 713, t: "Subarray Product Less Than K", d: "Medium", freq: 54, tags: [] },
    { id: 744, t: "Find Smallest Letter Greater Than Target", d: "Easy", freq: 59, tags: [] },
    { id: 766, t: "Toeplitz Matrix", d: "Easy", freq: 70, tags: [] },
    { id: 852, t: "Peak Index in a Mountain Array", d: "Medium", freq: 67, tags: [] },
    { id: 979, t: "Distribute Coins in Binary Tree", d: "Medium", freq: 77, tags: [] },
    { id: 1015, t: "Smallest Integer Divisible by K", d: "Medium", freq: 54, tags: [] },
    { id: 1025, t: "Divisor Game", d: "Easy", freq: 72, tags: [] },
    { id: 1143, t: "Longest Common Subsequence", d: "Medium", freq: 59, tags: [] },
    { id: 1365, t: "How Many Numbers Are Smaller Than the Current Number", d: "Easy", freq: 87, tags: [] },
    { id: 1368, t: "Minimum Cost to Make at Least One Valid Path in a Grid", d: "Hard", freq: 71, tags: [] },
    { id: 1378, t: "Replace Employee ID With The Unique Identifier", d: "Easy", freq: 84, tags: [] },
    { id: 1480, t: "Running Sum of 1d Array", d: "Easy", freq: 87, tags: [] },
    { id: 1492, t: "The kth Factor of n", d: "Medium", freq: 70, tags: [] },
    { id: 1497, t: "Check If Array Pairs Are Divisible by k", d: "Medium", freq: 46, tags: [] },
    { id: 1512, t: "Number of Good Pairs", d: "Easy", freq: 90, tags: [] },
    { id: 1614, t: "Maximum Nesting Depth of the Parentheses", d: "Easy", freq: 85, tags: [] },
    { id: 1636, t: "Sort Array by Increasing Frequency", d: "Easy", freq: 81, tags: [] },
    { id: 1745, t: "Palindrome Partitioning IV", d: "Hard", freq: 46, tags: [] },
    { id: 1751, t: "Maximum Number of Events That Can Be Attended II", d: "Hard", freq: 64, tags: [] },
    { id: 1910, t: "Remove All Occurrences of a Substring", d: "Medium", freq: 79, tags: [] },
    { id: 2461, t: "Maximum Sum of Distinct Subarrays With Length K", d: "Medium", freq: 43, tags: [] },
    { id: 2481, t: "Minimum Cuts to Divide a Circle", d: "Easy", freq: 56, tags: [] },
    { id: 2563, t: "Count the Number of Fair Pairs", d: "Medium", freq: 53, tags: [] },
    { id: 2703, t: "Return Length of Arguments Passed", d: "Easy", freq: 95, tags: [] },
    { id: 3065, t: "Minimum Operations to Exceed Threshold Value I", d: "Easy", freq: 87, tags: [] },
    { id: 3066, t: "Minimum Operations to Exceed Threshold Value II", d: "Medium", freq: 46, tags: [] },
    { id: 3136, t: "Valid Word", d: "Easy", freq: 51, tags: [] },
    { id: 3163, t: "String Compression III", d: "Medium", freq: 67, tags: [] },
    { id: 3330, t: "Find the Original Typed String I", d: "Easy", freq: 72, tags: [] },
    { id: 3714, t: "Longest Balanced Substring II", d: "Medium", freq: 42, tags: [] },
  ],
  Airbnb: [
    { id: 68, t: "Text Justification", d: "Hard", freq: 51, tags: [] },
    { id: 1235, t: "Maximum Profit in Job Scheduling", d: "Hard", freq: 55, tags: [] },
    { id: 251, t: "Flatten 2D Vector", d: "Medium", freq: 51, tags: [] },
    { id: 336, t: "Palindrome Pairs", d: "Hard", freq: 37, tags: [] },
    { id: 39, t: "Combination Sum", d: "Medium", freq: 77, tags: [] },
    { id: 1257, t: "Smallest Common Region", d: "Medium", freq: 68, tags: [] },
    { id: 2043, t: "Simple Bank System", d: "Medium", freq: 70, tags: [] },
    { id: 755, t: "Pour Water", d: "Medium", freq: 49, tags: [] },
    { id: 1298, t: "Maximum Candies You Can Get from Boxes", d: "Hard", freq: 67, tags: [] },
    { id: 76, t: "Minimum Window Substring", d: "Hard", freq: 48, tags: [] },
    { id: 42, t: "Trapping Rain Water", d: "Hard", freq: 68, tags: [] },
    { id: 631, t: "Design Excel Sum Formula", d: "Hard", freq: 40, tags: [] },
    { id: 773, t: "Sliding Puzzle", d: "Hard", freq: 75, tags: [] },
    { id: 348, t: "Design Tic-Tac-Toe", d: "Medium", freq: 59, tags: [] },
    { id: 713, t: "Subarray Product Less Than K", d: "Medium", freq: 54, tags: [] },
    { id: 160, t: "Intersection of Two Linked Lists", d: "Easy", freq: 64, tags: [] },
    { id: 219, t: "Contains Duplicate II", d: "Easy", freq: 51, tags: [] },
    { id: 269, t: "Alien Dictionary", d: "Hard", freq: 37, tags: [] },
    { id: 638, t: "Shopping Offers", d: "Medium", freq: 53, tags: [] },
    { id: 864, t: "Shortest Path to Get All Keys", d: "Hard", freq: 55, tags: [] },
    { id: 3076, t: "Shortest Uncommon Substring in an Array", d: "Medium", freq: 51, tags: [] },
    { id: 1, t: "Two Sum", d: "Easy", freq: 58, tags: [] },
    { id: 2, t: "Add Two Numbers", d: "Medium", freq: 49, tags: [] },
    { id: 212, t: "Word Search II", d: "Hard", freq: 39, tags: [] },
    { id: 432, t: "All O`one Data Structure", d: "Hard", freq: 44, tags: [] },
    { id: 751, t: "IP to CIDR", d: "Medium", freq: 54, tags: [] },
    { id: 759, t: "Employee Free Time", d: "Hard", freq: 73, tags: [] },
    { id: 787, t: "Cheapest Flights Within K Stops", d: "Medium", freq: 42, tags: [] },
    { id: 10, t: "Regular Expression Matching", d: "Hard", freq: 31, tags: [] },
    { id: 20, t: "Valid Parentheses", d: "Easy", freq: 44, tags: [] },
    { id: 23, t: "Merge k Sorted Lists", d: "Hard", freq: 60, tags: [] },
    { id: 53, t: "Maximum Subarray", d: "Medium", freq: 53, tags: [] },
    { id: 108, t: "Convert Sorted Array to Binary Search Tree", d: "Easy", freq: 76, tags: [] },
    { id: 136, t: "Single Number", d: "Easy", freq: 78, tags: [] },
    { id: 190, t: "Reverse Bits", d: "Easy", freq: 69, tags: [] },
    { id: 198, t: "House Robber", d: "Medium", freq: 53, tags: [] },
    { id: 202, t: "Happy Number", d: "Easy", freq: 60, tags: [] },
    { id: 217, t: "Contains Duplicate", d: "Easy", freq: 64, tags: [] },
    { id: 220, t: "Contains Duplicate III", d: "Hard", freq: 25, tags: [] },
    { id: 221, t: "Maximal Square", d: "Medium", freq: 50, tags: [] },
    { id: 227, t: "Basic Calculator II", d: "Medium", freq: 47, tags: [] },
    { id: 385, t: "Mini Parser", d: "Medium", freq: 43, tags: [] },
    { id: 400, t: "Nth Digit", d: "Medium", freq: 38, tags: [] },
    { id: 415, t: "Add Strings", d: "Easy", freq: 52, tags: [] },
    { id: 605, t: "Can Place Flowers", d: "Easy", freq: 29, tags: [] },
    { id: 756, t: "Pyramid Transition Matrix", d: "Medium", freq: 61, tags: [] },
    { id: 827, t: "Making A Large Island", d: "Hard", freq: 57, tags: [] },
    { id: 981, t: "Time Based Key-Value Store", d: "Medium", freq: 50, tags: [] },
    { id: 1017, t: "Convert to Base -2", d: "Medium", freq: 62, tags: [] },
    { id: 1041, t: "Robot Bounded In Circle", d: "Medium", freq: 57, tags: [] },
    { id: 1058, t: "Minimize Rounding Error to Meet Target", d: "Medium", freq: 46, tags: [] },
    { id: 1091, t: "Shortest Path in Binary Matrix", d: "Medium", freq: 52, tags: [] },
    { id: 1166, t: "Design File System", d: "Medium", freq: 65, tags: [] },
    { id: 1284, t: "Minimum Number of Flips to Convert Binary Matrix to Zero Matrix", d: "Hard", freq: 73, tags: [] },
    { id: 1554, t: "Strings Differ by One Character", d: "Medium", freq: 40, tags: [] },
    { id: 1557, t: "Minimum Number of Vertices to Reach All Nodes", d: "Medium", freq: 82, tags: [] },
    { id: 2189, t: "Number of Ways to Build House of Cards", d: "Medium", freq: 0, tags: [] },
  ],
  Pinterest: [
    { id: 332, t: "Reconstruct Itinerary", d: "Hard", freq: 45, tags: [] },
    { id: 465, t: "Optimal Account Balancing", d: "Hard", freq: 51, tags: [] },
    { id: 815, t: "Bus Routes", d: "Hard", freq: 47, tags: [] },
    { id: 282, t: "Expression Add Operators", d: "Hard", freq: 43, tags: [] },
    { id: 1293, t: "Shortest Path in a Grid with Obstacles Elimination", d: "Hard", freq: 46, tags: [] },
    { id: 38, t: "Count and Say", d: "Medium", freq: 63, tags: [] },
    { id: 2302, t: "Count Subarrays With Score Less Than K", d: "Hard", freq: 62, tags: [] },
    { id: 1055, t: "Shortest Way to Form String", d: "Medium", freq: 62, tags: [] },
    { id: 322, t: "Coin Change", d: "Medium", freq: 49, tags: [] },
    { id: 1235, t: "Maximum Profit in Job Scheduling", d: "Hard", freq: 55, tags: [] },
    { id: 295, t: "Find Median from Data Stream", d: "Hard", freq: 55, tags: [] },
    { id: 494, t: "Target Sum", d: "Medium", freq: 52, tags: [] },
    { id: 642, t: "Design Search Autocomplete System", d: "Hard", freq: 50, tags: [] },
    { id: 2402, t: "Meeting Rooms III", d: "Hard", freq: 52, tags: [] },
    { id: 767, t: "Reorganize String", d: "Medium", freq: 57, tags: [] },
    { id: 311, t: "Sparse Matrix Multiplication", d: "Medium", freq: 69, tags: [] },
    { id: 392, t: "Is Subsequence", d: "Easy", freq: 49, tags: [] },
    { id: 410, t: "Split Array Largest Sum", d: "Hard", freq: 61, tags: [] },
    { id: 1564, t: "Put Boxes Into the Warehouse I", d: "Medium", freq: 68, tags: [] },
    { id: 1580, t: "Put Boxes Into the Warehouse II", d: "Medium", freq: 66, tags: [] },
    { id: 1723, t: "Find Minimum Time to Finish All Jobs", d: "Hard", freq: 46, tags: [] },
    { id: 34, t: "Find First and Last Position of Element in Sorted Array", d: "Medium", freq: 49, tags: [] },
    { id: 43, t: "Multiply Strings", d: "Medium", freq: 44, tags: [] },
    { id: 720, t: "Longest Word in Dictionary", d: "Medium", freq: 55, tags: [] },
    { id: 721, t: "Accounts Merge", d: "Medium", freq: 61, tags: [] },
    { id: 723, t: "Candy Crush", d: "Medium", freq: 78, tags: [] },
    { id: 17, t: "Letter Combinations of a Phone Number", d: "Medium", freq: 66, tags: [] },
    { id: 23, t: "Merge k Sorted Lists", d: "Hard", freq: 60, tags: [] },
    { id: 39, t: "Combination Sum", d: "Medium", freq: 77, tags: [] },
    { id: 68, t: "Text Justification", d: "Hard", freq: 51, tags: [] },
    { id: 253, t: "Meeting Rooms II", d: "Medium", freq: 53, tags: [] },
    { id: 347, t: "Top K Frequent Elements", d: "Medium", freq: 67, tags: [] },
    { id: 443, t: "String Compression", d: "Medium", freq: 60, tags: [] },
    { id: 490, t: "The Maze", d: "Medium", freq: 60, tags: [] },
    { id: 571, t: "Find Median Given Frequency of Numbers", d: "Hard", freq: 42, tags: [] },
    { id: 759, t: "Employee Free Time", d: "Hard", freq: 73, tags: [] },
    { id: 1110, t: "Delete Nodes And Return Forest", d: "Medium", freq: 72, tags: [] },
    { id: 1570, t: "Dot Product of Two Sparse Vectors", d: "Medium", freq: 90, tags: [] },
    { id: 2232, t: "Minimize Result by Adding Parentheses to Expression", d: "Easy", freq: 68, tags: [] },
  ],
  Oracle: [
    { id: 146, t: "LRU Cache", d: "Medium", freq: 48, tags: [] },
    { id: 3, t: "Longest Substring Without Repeating Characters", d: "Medium", freq: 39, tags: [] },
    { id: 200, t: "Number of Islands", d: "Medium", freq: 65, tags: [] },
    { id: 1, t: "Two Sum", d: "Easy", freq: 58, tags: [] },
    { id: 49, t: "Group Anagrams", d: "Medium", freq: 73, tags: [] },
    { id: 347, t: "Top K Frequent Elements", d: "Medium", freq: 67, tags: [] },
    { id: 239, t: "Sliding Window Maximum", d: "Hard", freq: 49, tags: [] },
    { id: 23, t: "Merge k Sorted Lists", d: "Hard", freq: 60, tags: [] },
    { id: 20, t: "Valid Parentheses", d: "Easy", freq: 44, tags: [] },
    { id: 54, t: "Spiral Matrix", d: "Medium", freq: 57, tags: [] },
    { id: 56, t: "Merge Intervals", d: "Medium", freq: 52, tags: [] },
    { id: 253, t: "Meeting Rooms II", d: "Medium", freq: 53, tags: [] },
    { id: 5, t: "Longest Palindromic Substring", d: "Medium", freq: 38, tags: [] },
    { id: 1611, t: "Minimum One Bit Operations to Make Integers Zero", d: "Hard", freq: 78, tags: [] },
    { id: 15, t: "3Sum", d: "Medium", freq: 39, tags: [] },
    { id: 33, t: "Search in Rotated Sorted Array", d: "Medium", freq: 45, tags: [] },
    { id: 206, t: "Reverse Linked List", d: "Easy", freq: 81, tags: [] },
    { id: 128, t: "Longest Consecutive Sequence", d: "Medium", freq: 47, tags: [] },
    { id: 1200, t: "Minimum Absolute Difference", d: "Easy", freq: 75, tags: [] },
    { id: 242, t: "Valid Anagram", d: "Easy", freq: 68, tags: [] },
    { id: 460, t: "LFU Cache", d: "Hard", freq: 49, tags: [] },
    { id: 735, t: "Asteroid Collision", d: "Medium", freq: 48, tags: [] },
    { id: 3438, t: "Find Valid Pair of Adjacent Digits in String", d: "Easy", freq: 61, tags: [] },
    { id: 11, t: "Container With Most Water", d: "Medium", freq: 60, tags: [] },
    { id: 13, t: "Roman to Integer", d: "Easy", freq: 67, tags: [] },
    { id: 155, t: "Min Stack", d: "Medium", freq: 58, tags: [] },
    { id: 236, t: "Lowest Common Ancestor of a Binary Tree", d: "Medium", freq: 69, tags: [] },
    { id: 295, t: "Find Median from Data Stream", d: "Hard", freq: 55, tags: [] },
    { id: 450, t: "Delete Node in a BST", d: "Medium", freq: 55, tags: [] },
    { id: 994, t: "Rotting Oranges", d: "Medium", freq: 59, tags: [] },
    { id: 1209, t: "Remove All Adjacent Duplicates in String II", d: "Medium", freq: 61, tags: [] },
    { id: 1797, t: "Design Authentication Manager", d: "Medium", freq: 59, tags: [] },
    { id: 14, t: "Longest Common Prefix", d: "Easy", freq: 48, tags: [] },
    { id: 22, t: "Generate Parentheses", d: "Medium", freq: 79, tags: [] },
    { id: 42, t: "Trapping Rain Water", d: "Hard", freq: 68, tags: [] },
    { id: 53, t: "Maximum Subarray", d: "Medium", freq: 53, tags: [] },
    { id: 199, t: "Binary Tree Right Side View", d: "Medium", freq: 70, tags: [] },
    { id: 394, t: "Decode String", d: "Medium", freq: 63, tags: [] },
    { id: 41, t: "First Missing Positive", d: "Hard", freq: 43, tags: [] },
    { id: 71, t: "Simplify Path", d: "Medium", freq: 51, tags: [] },
    { id: 74, t: "Search a 2D Matrix", d: "Medium", freq: 54, tags: [] },
    { id: 75, t: "Sort Colors", d: "Medium", freq: 70, tags: [] },
    { id: 96, t: "Unique Binary Search Trees", d: "Medium", freq: 64, tags: [] },
    { id: 103, t: "Binary Tree Zigzag Level Order Traversal", d: "Medium", freq: 64, tags: [] },
    { id: 121, t: "Best Time to Buy and Sell Stock", d: "Easy", freq: 57, tags: [] },
    { id: 207, t: "Course Schedule", d: "Medium", freq: 52, tags: [] },
    { id: 215, t: "Kth Largest Element in an Array", d: "Medium", freq: 69, tags: [] },
    { id: 525, t: "Contiguous Array", d: "Medium", freq: 52, tags: [] },
    { id: 1353, t: "Maximum Number of Events That Can Be Attended", d: "Medium", freq: 39, tags: [] },
    { id: 4, t: "Median of Two Sorted Arrays", d: "Hard", freq: 47, tags: [] },
    { id: 6, t: "Zigzag Conversion", d: "Medium", freq: 54, tags: [] },
    { id: 93, t: "Restore IP Addresses", d: "Medium", freq: 56, tags: [] },
    { id: 124, t: "Binary Tree Maximum Path Sum", d: "Hard", freq: 42, tags: [] },
    { id: 138, t: "Copy List with Random Pointer", d: "Medium", freq: 63, tags: [] },
    { id: 169, t: "Majority Element", d: "Easy", freq: 66, tags: [] },
    { id: 208, t: "Implement Trie (Prefix Tree)", d: "Medium", freq: 70, tags: [] },
    { id: 230, t: "Kth Smallest Element in a BST", d: "Medium", freq: 77, tags: [] },
    { id: 283, t: "Move Zeroes", d: "Easy", freq: 64, tags: [] },
    { id: 380, t: "Insert Delete GetRandom O(1)", d: "Medium", freq: 55, tags: [] },
    { id: 621, t: "Task Scheduler", d: "Medium", freq: 63, tags: [] },
    { id: 697, t: "Degree of an Array", d: "Easy", freq: 58, tags: [] },
    { id: 875, t: "Koko Eating Bananas", d: "Medium", freq: 50, tags: [] },
    { id: 2954, t: "Count the Number of Infection Sequences", d: "Hard", freq: 38, tags: [] },
    { id: 12, t: "Integer to Roman", d: "Medium", freq: 71, tags: [] },
    { id: 17, t: "Letter Combinations of a Phone Number", d: "Medium", freq: 66, tags: [] },
    { id: 51, t: "N-Queens", d: "Hard", freq: 76, tags: [] },
    { id: 125, t: "Valid Palindrome", d: "Easy", freq: 53, tags: [] },
    { id: 127, t: "Word Ladder", d: "Hard", freq: 46, tags: [] },
    { id: 134, t: "Gas Station", d: "Medium", freq: 48, tags: [] },
    { id: 140, t: "Word Break II", d: "Hard", freq: 56, tags: [] },
    { id: 179, t: "Largest Number", d: "Medium", freq: 43, tags: [] },
    { id: 238, t: "Product of Array Except Self", d: "Medium", freq: 69, tags: [] },
    { id: 240, t: "Search a 2D Matrix II", d: "Medium", freq: 57, tags: [] },
    { id: 252, t: "Meeting Rooms", d: "Easy", freq: 60, tags: [] },
    { id: 300, t: "Longest Increasing Subsequence", d: "Medium", freq: 60, tags: [] },
    { id: 322, t: "Coin Change", d: "Medium", freq: 49, tags: [] },
    { id: 359, t: "Logger Rate Limiter", d: "Easy", freq: 77, tags: [] },
    { id: 443, t: "String Compression", d: "Medium", freq: 60, tags: [] },
    { id: 560, t: "Subarray Sum Equals K", d: "Medium", freq: 47, tags: [] },
    { id: 588, t: "Design In-Memory File System", d: "Hard", freq: 48, tags: [] },
    { id: 755, t: "Pour Water", d: "Medium", freq: 49, tags: [] },
    { id: 987, t: "Vertical Order Traversal of a Binary Tree", d: "Hard", freq: 54, tags: [] },
    { id: 2291, t: "Maximum Profit From Trading Stocks", d: "Medium", freq: 48, tags: [] },
    { id: 2, t: "Add Two Numbers", d: "Medium", freq: 49, tags: [] },
    { id: 9, t: "Palindrome Number", d: "Easy", freq: 61, tags: [] },
    { id: 31, t: "Next Permutation", d: "Medium", freq: 45, tags: [] },
    { id: 40, t: "Combination Sum II", d: "Medium", freq: 60, tags: [] },
    { id: 46, t: "Permutations", d: "Medium", freq: 82, tags: [] },
    { id: 73, t: "Set Matrix Zeroes", d: "Medium", freq: 63, tags: [] },
    { id: 79, t: "Word Search", d: "Medium", freq: 48, tags: [] },
    { id: 98, t: "Validate Binary Search Tree", d: "Medium", freq: 36, tags: [] },
    { id: 151, t: "Reverse Words in a String", d: "Medium", freq: 57, tags: [] },
    { id: 221, t: "Maximal Square", d: "Medium", freq: 50, tags: [] },
    { id: 345, t: "Reverse Vowels of a String", d: "Easy", freq: 61, tags: [] },
    { id: 647, t: "Palindromic Substrings", d: "Medium", freq: 73, tags: [] },
    { id: 692, t: "Top K Frequent Words", d: "Medium", freq: 60, tags: [] },
    { id: 694, t: "Number of Distinct Islands", d: "Medium", freq: 63, tags: [] },
    { id: 2062, t: "Count Vowel Substrings of a String", d: "Easy", freq: 73, tags: [] },
    { id: 21, t: "Merge Two Sorted Lists", d: "Easy", freq: 68, tags: [] },
    { id: 26, t: "Remove Duplicates from Sorted Array", d: "Easy", freq: 63, tags: [] },
    { id: 29, t: "Divide Two Integers", d: "Medium", freq: 20, tags: [] },
    { id: 34, t: "Find First and Last Position of Element in Sorted Array", d: "Medium", freq: 49, tags: [] },
    { id: 48, t: "Rotate Image", d: "Medium", freq: 80, tags: [] },
    { id: 55, t: "Jump Game", d: "Medium", freq: 41, tags: [] },
    { id: 61, t: "Rotate List", d: "Medium", freq: 43, tags: [] },
    { id: 102, t: "Binary Tree Level Order Traversal", d: "Medium", freq: 73, tags: [] },
    { id: 130, t: "Surrounded Regions", d: "Medium", freq: 45, tags: [] },
    { id: 141, t: "Linked List Cycle", d: "Easy", freq: 54, tags: [] },
    { id: 176, t: "Second Highest Salary", d: "Medium", freq: 47, tags: [] },
    { id: 198, t: "House Robber", d: "Medium", freq: 53, tags: [] },
    { id: 205, t: "Isomorphic Strings", d: "Easy", freq: 49, tags: [] },
    { id: 210, t: "Course Schedule II", d: "Medium", freq: 56, tags: [] },
    { id: 498, t: "Diagonal Traverse", d: "Medium", freq: 67, tags: [] },
    { id: 540, t: "Single Element in a Sorted Array", d: "Medium", freq: 59, tags: [] },
    { id: 543, t: "Diameter of Binary Tree", d: "Easy", freq: 66, tags: [] },
    { id: 567, t: "Permutation in String", d: "Medium", freq: 49, tags: [] },
    { id: 582, t: "Kill Process", d: "Medium", freq: 71, tags: [] },
    { id: 706, t: "Design HashMap", d: "Easy", freq: 67, tags: [] },
    { id: 829, t: "Consecutive Numbers Sum", d: "Hard", freq: 43, tags: [] },
    { id: 912, t: "Sort an Array", d: "Medium", freq: 56, tags: [] },
    { id: 1010, t: "Pairs of Songs With Total Durations Divisible by 60", d: "Medium", freq: 54, tags: [] },
    { id: 1011, t: "Capacity To Ship Packages Within D Days", d: "Medium", freq: 74, tags: [] },
    { id: 1235, t: "Maximum Profit in Job Scheduling", d: "Hard", freq: 55, tags: [] },
    { id: 1268, t: "Search Suggestions System", d: "Medium", freq: 65, tags: [] },
    { id: 1283, t: "Find the Smallest Divisor Given a Threshold", d: "Medium", freq: 66, tags: [] },
    { id: 1823, t: "Find the Winner of the Circular Game", d: "Medium", freq: 82, tags: [] },
    { id: 1944, t: "Number of Visible People in a Queue", d: "Hard", freq: 73, tags: [] },
    { id: 2151, t: "Maximum Good People Based on Statements", d: "Hard", freq: 53, tags: [] },
    { id: 7, t: "Reverse Integer", d: "Medium", freq: 32, tags: [] },
    { id: 10, t: "Regular Expression Matching", d: "Hard", freq: 31, tags: [] },
    { id: 36, t: "Valid Sudoku", d: "Medium", freq: 65, tags: [] },
    { id: 45, t: "Jump Game II", d: "Medium", freq: 43, tags: [] },
    { id: 50, t: "Pow(x, n)", d: "Medium", freq: 39, tags: [] },
    { id: 69, t: "Sqrt(x)", d: "Easy", freq: 42, tags: [] },
    { id: 70, t: "Climbing Stairs", d: "Easy", freq: 54, tags: [] },
    { id: 83, t: "Remove Duplicates from Sorted List", d: "Easy", freq: 57, tags: [] },
    { id: 88, t: "Merge Sorted Array", d: "Easy", freq: 55, tags: [] },
    { id: 92, t: "Reverse Linked List II", d: "Medium", freq: 52, tags: [] },
    { id: 114, t: "Flatten Binary Tree to Linked List", d: "Medium", freq: 71, tags: [] },
    { id: 115, t: "Distinct Subsequences", d: "Hard", freq: 52, tags: [] },
    { id: 116, t: "Populating Next Right Pointers in Each Node", d: "Medium", freq: 67, tags: [] },
    { id: 120, t: "Triangle", d: "Medium", freq: 60, tags: [] },
    { id: 133, t: "Clone Graph", d: "Medium", freq: 65, tags: [] },
    { id: 135, t: "Candy", d: "Hard", freq: 49, tags: [] },
    { id: 139, t: "Word Break", d: "Medium", freq: 50, tags: [] },
    { id: 148, t: "Sort List", d: "Medium", freq: 65, tags: [] },
    { id: 209, t: "Minimum Size Subarray Sum", d: "Medium", freq: 52, tags: [] },
    { id: 217, t: "Contains Duplicate", d: "Easy", freq: 64, tags: [] },
    { id: 224, t: "Basic Calculator", d: "Hard", freq: 47, tags: [] },
    { id: 227, t: "Basic Calculator II", d: "Medium", freq: 47, tags: [] },
    { id: 237, t: "Delete Node in a Linked List", d: "Medium", freq: 84, tags: [] },
    { id: 273, t: "Integer to English Words", d: "Hard", freq: 35, tags: [] },
    { id: 340, t: "Longest Substring with At Most K Distinct Characters", d: "Medium", freq: 50, tags: [] },
    { id: 387, t: "First Unique Character in a String", d: "Easy", freq: 66, tags: [] },
    { id: 403, t: "Frog Jump", d: "Hard", freq: 47, tags: [] },
    { id: 435, t: "Non-overlapping Intervals", d: "Medium", freq: 57, tags: [] },
    { id: 463, t: "Island Perimeter", d: "Easy", freq: 75, tags: [] },
    { id: 496, t: "Next Greater Element I", d: "Easy", freq: 76, tags: [] },
    { id: 696, t: "Count Binary Substrings", d: "Easy", freq: 70, tags: [] },
    { id: 713, t: "Subarray Product Less Than K", d: "Medium", freq: 54, tags: [] },
    { id: 739, t: "Daily Temperatures", d: "Medium", freq: 69, tags: [] },
    { id: 767, t: "Reorganize String", d: "Medium", freq: 57, tags: [] },
    { id: 796, t: "Rotate String", d: "Easy", freq: 67, tags: [] },
    { id: 841, t: "Keys and Rooms", d: "Medium", freq: 76, tags: [] },
    { id: 845, t: "Longest Mountain in Array", d: "Medium", freq: 42, tags: [] },
    { id: 863, t: "All Nodes Distance K in Binary Tree", d: "Medium", freq: 68, tags: [] },
    { id: 981, t: "Time Based Key-Value Store", d: "Medium", freq: 50, tags: [] },
    { id: 1047, t: "Remove All Adjacent Duplicates In String", d: "Easy", freq: 73, tags: [] },
    { id: 1190, t: "Reverse Substrings Between Each Pair of Parentheses", d: "Medium", freq: 72, tags: [] },
    { id: 1249, t: "Minimum Remove to Make Valid Parentheses", d: "Medium", freq: 72, tags: [] },
    { id: 1507, t: "Reformat Date", d: "Easy", freq: 69, tags: [] },
    { id: 1669, t: "Merge In Between Linked Lists", d: "Medium", freq: 83, tags: [] },
    { id: 2008, t: "Maximum Earnings From Taxi", d: "Medium", freq: 47, tags: [] },
    { id: 2303, t: "Calculate Amount Paid in Taxes", d: "Easy", freq: 69, tags: [] },
    { id: 2402, t: "Meeting Rooms III", d: "Hard", freq: 52, tags: [] },
    { id: 2448, t: "Minimum Cost to Make Array Equal", d: "Hard", freq: 47, tags: [] },
    { id: 2472, t: "Maximum Number of Non-overlapping Palindrome Substrings", d: "Hard", freq: 45, tags: [] },
    { id: 2506, t: "Count Pairs Of Similar Strings", d: "Easy", freq: 74, tags: [] },
    { id: 2561, t: "Rearranging Fruits", d: "Hard", freq: 57, tags: [] },
    { id: 2836, t: "Maximize Value of Function in a Ball Passing Game", d: "Hard", freq: 31, tags: [] },
    { id: 3366, t: "Minimum Array Sum", d: "Medium", freq: 32, tags: [] },
    { id: 19, t: "Remove Nth Node From End of List", d: "Medium", freq: 52, tags: [] },
    { id: 24, t: "Swap Nodes in Pairs", d: "Medium", freq: 70, tags: [] },
    { id: 38, t: "Count and Say", d: "Medium", freq: 63, tags: [] },
    { id: 43, t: "Multiply Strings", d: "Medium", freq: 44, tags: [] },
    { id: 57, t: "Insert Interval", d: "Medium", freq: 45, tags: [] },
    { id: 68, t: "Text Justification", d: "Hard", freq: 51, tags: [] },
    { id: 72, t: "Edit Distance", d: "Medium", freq: 61, tags: [] },
    { id: 76, t: "Minimum Window Substring", d: "Hard", freq: 48, tags: [] },
    { id: 78, t: "Subsets", d: "Medium", freq: 82, tags: [] },
    { id: 82, t: "Remove Duplicates from Sorted List II", d: "Medium", freq: 52, tags: [] },
    { id: 84, t: "Largest Rectangle in Histogram", d: "Hard", freq: 50, tags: [] },
    { id: 91, t: "Decode Ways", d: "Medium", freq: 38, tags: [] },
    { id: 113, t: "Path Sum II", d: "Medium", freq: 62, tags: [] },
    { id: 142, t: "Linked List Cycle II", d: "Medium", freq: 58, tags: [] },
    { id: 150, t: "Evaluate Reverse Polish Notation", d: "Medium", freq: 58, tags: [] },
    { id: 153, t: "Find Minimum in Rotated Sorted Array", d: "Medium", freq: 55, tags: [] },
    { id: 162, t: "Find Peak Element", d: "Medium", freq: 47, tags: [] },
    { id: 166, t: "Fraction to Recurring Decimal", d: "Medium", freq: 31, tags: [] },
    { id: 189, t: "Rotate Array", d: "Medium", freq: 45, tags: [] },
    { id: 203, t: "Remove Linked List Elements", d: "Easy", freq: 55, tags: [] },
  ],
  Visa: [
    { id: 1, t: "Two Sum", d: "Easy", freq: 58, tags: [] },
    { id: 3, t: "Longest Substring Without Repeating Characters", d: "Medium", freq: 39, tags: [] },
    { id: 4, t: "Median of Two Sorted Arrays", d: "Hard", freq: 47, tags: [] },
    { id: 5, t: "Longest Palindromic Substring", d: "Medium", freq: 38, tags: [] },
    { id: 11, t: "Container With Most Water", d: "Medium", freq: 60, tags: [] },
    { id: 14, t: "Longest Common Prefix", d: "Easy", freq: 48, tags: [] },
    { id: 15, t: "3Sum", d: "Medium", freq: 39, tags: [] },
    { id: 17, t: "Letter Combinations of a Phone Number", d: "Medium", freq: 66, tags: [] },
    { id: 20, t: "Valid Parentheses", d: "Easy", freq: 44, tags: [] },
    { id: 21, t: "Merge Two Sorted Lists", d: "Easy", freq: 68, tags: [] },
    { id: 25, t: "Reverse Nodes in k-Group", d: "Hard", freq: 66, tags: [] },
    { id: 32, t: "Longest Valid Parentheses", d: "Hard", freq: 39, tags: [] },
    { id: 42, t: "Trapping Rain Water", d: "Hard", freq: 68, tags: [] },
    { id: 48, t: "Rotate Image", d: "Medium", freq: 80, tags: [] },
    { id: 49, t: "Group Anagrams", d: "Medium", freq: 73, tags: [] },
    { id: 53, t: "Maximum Subarray", d: "Medium", freq: 53, tags: [] },
    { id: 54, t: "Spiral Matrix", d: "Medium", freq: 57, tags: [] },
    { id: 56, t: "Merge Intervals", d: "Medium", freq: 52, tags: [] },
    { id: 62, t: "Unique Paths", d: "Medium", freq: 67, tags: [] },
    { id: 68, t: "Text Justification", d: "Hard", freq: 51, tags: [] },
    { id: 71, t: "Simplify Path", d: "Medium", freq: 51, tags: [] },
    { id: 72, t: "Edit Distance", d: "Medium", freq: 61, tags: [] },
    { id: 75, t: "Sort Colors", d: "Medium", freq: 70, tags: [] },
    { id: 84, t: "Largest Rectangle in Histogram", d: "Hard", freq: 50, tags: [] },
    { id: 93, t: "Restore IP Addresses", d: "Medium", freq: 56, tags: [] },
    { id: 110, t: "Balanced Binary Tree", d: "Easy", freq: 59, tags: [] },
    { id: 121, t: "Best Time to Buy and Sell Stock", d: "Easy", freq: 57, tags: [] },
    { id: 122, t: "Best Time to Buy and Sell Stock II", d: "Medium", freq: 71, tags: [] },
    { id: 123, t: "Best Time to Buy and Sell Stock III", d: "Hard", freq: 54, tags: [] },
    { id: 127, t: "Word Ladder", d: "Hard", freq: 46, tags: [] },
    { id: 129, t: "Sum Root to Leaf Numbers", d: "Medium", freq: 70, tags: [] },
    { id: 134, t: "Gas Station", d: "Medium", freq: 48, tags: [] },
    { id: 135, t: "Candy", d: "Hard", freq: 49, tags: [] },
    { id: 1389, t: "Create Target Array in the Given Order", d: "Easy", freq: 87, tags: [] },
    { id: 139, t: "Word Break", d: "Medium", freq: 50, tags: [] },
    { id: 140, t: "Word Break II", d: "Hard", freq: 56, tags: [] },
    { id: 146, t: "LRU Cache", d: "Medium", freq: 48, tags: [] },
    { id: 1497, t: "Check If Array Pairs Are Divisible by k", d: "Medium", freq: 46, tags: [] },
    { id: 151, t: "Reverse Words in a String", d: "Medium", freq: 57, tags: [] },
    { id: 162, t: "Find Peak Element", d: "Medium", freq: 47, tags: [] },
    { id: 167, t: "Two Sum II - Input Array Is Sorted", d: "Medium", freq: 65, tags: [] },
    { id: 1743, t: "Restore the Array From Adjacent Pairs", d: "Medium", freq: 75, tags: [] },
    { id: 1752, t: "Check if Array Is Sorted and Rotated", d: "Easy", freq: 57, tags: [] },
    { id: 1861, t: "Rotating the Box", d: "Medium", freq: 83, tags: [] },
    { id: 1876, t: "Substrings of Size Three with Distinct Characters", d: "Easy", freq: 77, tags: [] },
    { id: 189, t: "Rotate Array", d: "Medium", freq: 45, tags: [] },
    { id: 199, t: "Binary Tree Right Side View", d: "Medium", freq: 70, tags: [] },
    { id: 200, t: "Number of Islands", d: "Medium", freq: 65, tags: [] },
    { id: 202, t: "Happy Number", d: "Easy", freq: 60, tags: [] },
    { id: 2021, t: "Brightest Position on Street", d: "Medium", freq: 61, tags: [] },
    { id: 2049, t: "Count Nodes With the Highest Score", d: "Medium", freq: 53, tags: [] },
    { id: 206, t: "Reverse Linked List", d: "Easy", freq: 81, tags: [] },
    { id: 207, t: "Course Schedule", d: "Medium", freq: 52, tags: [] },
    { id: 2078, t: "Two Furthest Houses With Different Colors", d: "Easy", freq: 72, tags: [] },
    { id: 213, t: "House Robber II", d: "Medium", freq: 45, tags: [] },
    { id: 2136, t: "Earliest Possible Day of Full Bloom", d: "Hard", freq: 71, tags: [] },
    { id: 214, t: "Shortest Palindrome", d: "Hard", freq: 43, tags: [] },
    { id: 215, t: "Kth Largest Element in an Array", d: "Medium", freq: 69, tags: [] },
    { id: 217, t: "Contains Duplicate", d: "Easy", freq: 64, tags: [] },
    { id: 238, t: "Product of Array Except Self", d: "Medium", freq: 69, tags: [] },
    { id: 239, t: "Sliding Window Maximum", d: "Hard", freq: 49, tags: [] },
    { id: 242, t: "Valid Anagram", d: "Easy", freq: 68, tags: [] },
    { id: 2451, t: "Odd String Difference", d: "Easy", freq: 62, tags: [] },
    { id: 2502, t: "Design Memory Allocator", d: "Medium", freq: 50, tags: [] },
    { id: 2593, t: "Find Score of an Array After Marking All Elements", d: "Medium", freq: 65, tags: [] },
    { id: 264, t: "Ugly Number II", d: "Medium", freq: 50, tags: [] },
    { id: 2672, t: "Number of Adjacent Elements With the Same Color", d: "Medium", freq: 60, tags: [] },
    { id: 2768, t: "Number of Black Blocks", d: "Medium", freq: 42, tags: [] },
    { id: 2817, t: "Minimum Absolute Difference Between Elements With Constraint", d: "Medium", freq: 38, tags: [] },
    { id: 286, t: "Walls and Gates", d: "Medium", freq: 64, tags: [] },
    { id: 295, t: "Find Median from Data Stream", d: "Hard", freq: 55, tags: [] },
    { id: 3, t: "Longest Substring Without Repeating Characters", d: "Medium", freq: 39, tags: [] },
    { id: 300, t: "Longest Increasing Subsequence", d: "Medium", freq: 60, tags: [] },
    { id: 3034, t: "Number of Subarrays That Match a Pattern I", d: "Medium", freq: 69, tags: [] },
    { id: 3043, t: "Find the Length of the Longest Common Prefix", d: "Medium", freq: 62, tags: [] },
    { id: 3046, t: "Split the Array", d: "Easy", freq: 61, tags: [] },
    { id: 3071, t: "Minimum Operations to Write the Letter Y on a Grid", d: "Medium", freq: 65, tags: [] },
    { id: 3078, t: "Match Alphanumerical Pattern in Matrix I", d: "Medium", freq: 65, tags: [] },
    { id: 3161, t: "Block Placement Queries", d: "Hard", freq: 42, tags: [] },
    { id: 32, t: "Longest Valid Parentheses", d: "Hard", freq: 39, tags: [] },
    { id: 345, t: "Reverse Vowels of a String", d: "Easy", freq: 61, tags: [] },
    { id: 3459, t: "Length of Longest V-Shaped Diagonal Segment", d: "Hard", freq: 56, tags: [] },
    { id: 347, t: "Top K Frequent Elements", d: "Medium", freq: 67, tags: [] },
    { id: 3552, t: "Grid Teleportation Traversal", d: "Medium", freq: 24, tags: [] },
    { id: 416, t: "Partition Equal Subset Sum", d: "Medium", freq: 50, tags: [] },
    { id: 42, t: "Trapping Rain Water", d: "Hard", freq: 68, tags: [] },
    { id: 451, t: "Sort Characters By Frequency", d: "Medium", freq: 75, tags: [] },
    { id: 460, t: "LFU Cache", d: "Hard", freq: 49, tags: [] },
    { id: 48, t: "Rotate Image", d: "Medium", freq: 80, tags: [] },
    { id: 49, t: "Group Anagrams", d: "Medium", freq: 73, tags: [] },
    { id: 5, t: "Longest Palindromic Substring", d: "Medium", freq: 38, tags: [] },
    { id: 53, t: "Maximum Subarray", d: "Medium", freq: 53, tags: [] },
    { id: 54, t: "Spiral Matrix", d: "Medium", freq: 57, tags: [] },
    { id: 56, t: "Merge Intervals", d: "Medium", freq: 52, tags: [] },
    { id: 560, t: "Subarray Sum Equals K", d: "Medium", freq: 47, tags: [] },
    { id: 62, t: "Unique Paths", d: "Medium", freq: 67, tags: [] },
    { id: 68, t: "Text Justification", d: "Hard", freq: 51, tags: [] },
    { id: 71, t: "Simplify Path", d: "Medium", freq: 51, tags: [] },
    { id: 72, t: "Edit Distance", d: "Medium", freq: 61, tags: [] },
    { id: 739, t: "Daily Temperatures", d: "Medium", freq: 69, tags: [] },
    { id: 75, t: "Sort Colors", d: "Medium", freq: 70, tags: [] },
    { id: 792, t: "Number of Matching Subsequences", d: "Medium", freq: 51, tags: [] },
    { id: 84, t: "Largest Rectangle in Histogram", d: "Hard", freq: 50, tags: [] },
    { id: 93, t: "Restore IP Addresses", d: "Medium", freq: 56, tags: [] },
    { id: 994, t: "Rotting Oranges", d: "Medium", freq: 59, tags: [] },
    { id: 1025, t: "Divisor Game", d: "Easy", freq: 72, tags: [] },
    { id: 1046, t: "Last Stone Weight", d: "Easy", freq: 67, tags: [] },
    { id: 110, t: "Balanced Binary Tree", d: "Easy", freq: 59, tags: [] },
    { id: 11, t: "Container With Most Water", d: "Medium", freq: 60, tags: [] },
    { id: 121, t: "Best Time to Buy and Sell Stock", d: "Easy", freq: 57, tags: [] },
    { id: 122, t: "Best Time to Buy and Sell Stock II", d: "Medium", freq: 71, tags: [] },
    { id: 123, t: "Best Time to Buy and Sell Stock III", d: "Hard", freq: 54, tags: [] },
    { id: 127, t: "Word Ladder", d: "Hard", freq: 46, tags: [] },
    { id: 129, t: "Sum Root to Leaf Numbers", d: "Medium", freq: 70, tags: [] },
    { id: 1314, t: "Matrix Block Sum", d: "Medium", freq: 77, tags: [] },
    { id: 134, t: "Gas Station", d: "Medium", freq: 48, tags: [] },
    { id: 135, t: "Candy", d: "Hard", freq: 49, tags: [] },
    { id: 139, t: "Word Break", d: "Medium", freq: 50, tags: [] },
    { id: 140, t: "Word Break II", d: "Hard", freq: 56, tags: [] },
    { id: 146, t: "LRU Cache", d: "Medium", freq: 48, tags: [] },
    { id: 151, t: "Reverse Words in a String", d: "Medium", freq: 57, tags: [] },
    { id: 162, t: "Find Peak Element", d: "Medium", freq: 47, tags: [] },
    { id: 167, t: "Two Sum II - Input Array Is Sorted", d: "Medium", freq: 65, tags: [] },
    { id: 17, t: "Letter Combinations of a Phone Number", d: "Medium", freq: 66, tags: [] },
    { id: 1743, t: "Restore the Array From Adjacent Pairs", d: "Medium", freq: 75, tags: [] },
    { id: 1752, t: "Check if Array Is Sorted and Rotated", d: "Easy", freq: 57, tags: [] },
    { id: 1876, t: "Substrings of Size Three with Distinct Characters", d: "Easy", freq: 77, tags: [] },
    { id: 189, t: "Rotate Array", d: "Medium", freq: 45, tags: [] },
    { id: 199, t: "Binary Tree Right Side View", d: "Medium", freq: 70, tags: [] },
    { id: 20, t: "Valid Parentheses", d: "Easy", freq: 44, tags: [] },
    { id: 200, t: "Number of Islands", d: "Medium", freq: 65, tags: [] },
    { id: 202, t: "Happy Number", d: "Easy", freq: 60, tags: [] },
    { id: 2021, t: "Brightest Position on Street", d: "Medium", freq: 61, tags: [] },
    { id: 2049, t: "Count Nodes With the Highest Score", d: "Medium", freq: 53, tags: [] },
    { id: 206, t: "Reverse Linked List", d: "Easy", freq: 81, tags: [] },
    { id: 207, t: "Course Schedule", d: "Medium", freq: 52, tags: [] },
    { id: 2078, t: "Two Furthest Houses With Different Colors", d: "Easy", freq: 72, tags: [] },
    { id: 21, t: "Merge Two Sorted Lists", d: "Easy", freq: 68, tags: [] },
    { id: 213, t: "House Robber II", d: "Medium", freq: 45, tags: [] },
    { id: 2136, t: "Earliest Possible Day of Full Bloom", d: "Hard", freq: 71, tags: [] },
    { id: 214, t: "Shortest Palindrome", d: "Hard", freq: 43, tags: [] },
    { id: 215, t: "Kth Largest Element in an Array", d: "Medium", freq: 69, tags: [] },
    { id: 217, t: "Contains Duplicate", d: "Easy", freq: 64, tags: [] },
    { id: 238, t: "Product of Array Except Self", d: "Medium", freq: 69, tags: [] },
    { id: 239, t: "Sliding Window Maximum", d: "Hard", freq: 49, tags: [] },
    { id: 242, t: "Valid Anagram", d: "Easy", freq: 68, tags: [] },
    { id: 2451, t: "Odd String Difference", d: "Easy", freq: 62, tags: [] },
    { id: 25, t: "Reverse Nodes in k-Group", d: "Hard", freq: 66, tags: [] },
    { id: 2502, t: "Design Memory Allocator", d: "Medium", freq: 50, tags: [] },
    { id: 2593, t: "Find Score of an Array After Marking All Elements", d: "Medium", freq: 65, tags: [] },
    { id: 264, t: "Ugly Number II", d: "Medium", freq: 50, tags: [] },
    { id: 2672, t: "Number of Adjacent Elements With the Same Color", d: "Medium", freq: 60, tags: [] },
    { id: 2768, t: "Number of Black Blocks", d: "Medium", freq: 42, tags: [] },
    { id: 2817, t: "Minimum Absolute Difference Between Elements With Constraint", d: "Medium", freq: 38, tags: [] },
    { id: 286, t: "Walls and Gates", d: "Medium", freq: 64, tags: [] },
    { id: 295, t: "Find Median from Data Stream", d: "Hard", freq: 55, tags: [] },
    { id: 3, t: "Longest Substring Without Repeating Characters", d: "Medium", freq: 39, tags: [] },
    { id: 300, t: "Longest Increasing Subsequence", d: "Medium", freq: 60, tags: [] },
    { id: 3034, t: "Number of Subarrays That Match a Pattern I", d: "Medium", freq: 69, tags: [] },
    { id: 3043, t: "Find the Length of the Longest Common Prefix", d: "Medium", freq: 62, tags: [] },
    { id: 3046, t: "Split the Array", d: "Easy", freq: 61, tags: [] },
    { id: 3071, t: "Minimum Operations to Write the Letter Y on a Grid", d: "Medium", freq: 65, tags: [] },
    { id: 3078, t: "Match Alphanumerical Pattern in Matrix I", d: "Medium", freq: 65, tags: [] },
    { id: 3161, t: "Block Placement Queries", d: "Hard", freq: 42, tags: [] },
    { id: 32, t: "Longest Valid Parentheses", d: "Hard", freq: 39, tags: [] },
    { id: 345, t: "Reverse Vowels of a String", d: "Easy", freq: 61, tags: [] },
    { id: 3459, t: "Length of Longest V-Shaped Diagonal Segment", d: "Hard", freq: 56, tags: [] },
    { id: 347, t: "Top K Frequent Elements", d: "Medium", freq: 67, tags: [] },
    { id: 3552, t: "Grid Teleportation Traversal", d: "Medium", freq: 24, tags: [] },
    { id: 416, t: "Partition Equal Subset Sum", d: "Medium", freq: 50, tags: [] },
    { id: 42, t: "Trapping Rain Water", d: "Hard", freq: 68, tags: [] },
    { id: 451, t: "Sort Characters By Frequency", d: "Medium", freq: 75, tags: [] },
    { id: 460, t: "LFU Cache", d: "Hard", freq: 49, tags: [] },
    { id: 48, t: "Rotate Image", d: "Medium", freq: 80, tags: [] },
    { id: 49, t: "Group Anagrams", d: "Medium", freq: 73, tags: [] },
    { id: 5, t: "Longest Palindromic Substring", d: "Medium", freq: 38, tags: [] },
    { id: 53, t: "Maximum Subarray", d: "Medium", freq: 53, tags: [] },
    { id: 54, t: "Spiral Matrix", d: "Medium", freq: 57, tags: [] },
    { id: 56, t: "Merge Intervals", d: "Medium", freq: 52, tags: [] },
    { id: 560, t: "Subarray Sum Equals K", d: "Medium", freq: 47, tags: [] },
    { id: 62, t: "Unique Paths", d: "Medium", freq: 67, tags: [] },
    { id: 68, t: "Text Justification", d: "Hard", freq: 51, tags: [] },
    { id: 71, t: "Simplify Path", d: "Medium", freq: 51, tags: [] },
    { id: 72, t: "Edit Distance", d: "Medium", freq: 61, tags: [] },
    { id: 739, t: "Daily Temperatures", d: "Medium", freq: 69, tags: [] },
    { id: 75, t: "Sort Colors", d: "Medium", freq: 70, tags: [] },
    { id: 792, t: "Number of Matching Subsequences", d: "Medium", freq: 51, tags: [] },
    { id: 84, t: "Largest Rectangle in Histogram", d: "Hard", freq: 50, tags: [] },
    { id: 93, t: "Restore IP Addresses", d: "Medium", freq: 56, tags: [] },
    { id: 994, t: "Rotting Oranges", d: "Medium", freq: 59, tags: [] },
    { id: 1025, t: "Divisor Game", d: "Easy", freq: 72, tags: [] },
    { id: 1046, t: "Last Stone Weight", d: "Easy", freq: 67, tags: [] },
  ],
};

const googleRecentQuestionFeed = `
1. Two Sum
57.6%
Easy

2. Add Two Numbers
48.6%
Med.

14. Longest Common Prefix
47.7%
Easy

1929. Concatenation of Array
90.3%
Easy

121. Best Time to Buy and Sell Stock
56.9%
Easy

3. Longest Substring Without Repeating Characters
39.2%
Med.

9. Palindrome Number
60.6%
Easy

4. Median of Two Sorted Arrays
46.7%
Hard

11. Container With Most Water
60.1%
Med.

15. 3Sum
39.2%
Med.

42. Trapping Rain Water
67.5%
Hard

5. Longest Palindromic Substring
37.9%
Med.

13. Roman to Integer
66.7%
Easy

128. Longest Consecutive Sequence
47.1%
Med.

26. Remove Duplicates from Sorted Array
62.9%
Easy

169. Majority Element
66.3%
Easy

560. Subarray Sum Equals K
47.4%
Med.

56. Merge Intervals
52.0%
Med.

175. Combine Two Tables
79.6%
Easy

7. Reverse Integer
32.0%
Med.

53. Maximum Subarray
53.4%
Med.

88. Merge Sorted Array
55.0%
Easy

20. Valid Parentheses
44.3%
Easy

2667. Create Hello World Function
81.9%
Easy

200. Number of Islands
64.5%
Med.

347. Top K Frequent Elements
66.6%
Med.

206. Reverse Linked List
80.6%
Easy

875. Koko Eating Bananas
50.1%
Med.

21. Merge Two Sorted Lists
68.4%
Easy

54. Spiral Matrix
56.9%
Med.

242. Valid Anagram
68.2%
Easy

215. Kth Largest Element in an Array
69.0%
Med.

217. Contains Duplicate
64.4%
Easy

51. N-Queens
75.7%
Hard

22. Generate Parentheses
78.7%
Med.

31. Next Permutation
45.4%
Med.

33. Search in Rotated Sorted Array
45.0%
Med.

55. Jump Game
41.0%
Med.

146. LRU Cache
47.4%
Med.

1502. Can Make Arithmetic Progression From Sequence
68.8%
Easy

283. Move Zeroes
63.9%
Easy

394. Decode String
62.7%
Med.

1768. Merge Strings Alternately
82.1%
Easy

49. Group Anagrams
72.7%
Med.

66. Plus One
50.0%
Easy

70. Climbing Stairs
54.1%
Easy

198. House Robber
53.3%
Med.

67. Add Binary
58.1%
Easy

167. Two Sum II - Input Array Is Sorted
65.2%
Med.

238. Product of Array Except Self
68.9%
Med.

300. Longest Increasing Subsequence
59.5%
Med.

704. Binary Search
60.9%
Easy

1944. Number of Visible People in a Queue
73.2%
Hard

46. Permutations
82.0%
Med.

118. Pascal's Triangle
79.0%
Easy

125. Valid Palindrome
53.4%
Easy

485. Max Consecutive Ones
65.3%
Easy

27. Remove Element
61.9%
Easy

48. Rotate Image
80.2%
Med.

75. Sort Colors
69.7%
Med.

84. Largest Rectangle in Histogram
50.0%
Hard

85. Maximal Rectangle
58.9%
Hard

136. Single Number
77.8%
Easy

202. Happy Number
59.7%
Easy

207. Course Schedule
51.5%
Med.

349. Intersection of Two Arrays
77.8%
Easy

424. Longest Repeating Character Replacement
59.8%
Med.

540. Single Element in a Sorted Array
59.3%
Med.

1757. Recyclable and Low Fat Products
88.6%
Easy

17. Letter Combinations of a Phone Number
66.2%
Med.

18. 4Sum
40.8%
Med.

28. Find the Index of the First Occurrence in a String
46.7%
Easy

78. Subsets
82.4%
Med.

100. Same Tree
67.2%
Easy

162. Find Peak Element
47.0%
Med.

253. Meeting Rooms II
52.7%
Med.

410. Split Array Largest Sum
60.6%
Hard

34. Find First and Last Position of Element in Sorted Array
49.0%
Med.

35. Search Insert Position
51.4%
Easy

239. Sliding Window Maximum
48.8%
Hard

359. Logger Rate Limiter
76.8%
Easy

912. Sort an Array
55.9%
Med.

1004. Max Consecutive Ones III
67.8%
Med.

10. Regular Expression Matching
31.0%
Hard

189. Rotate Array
45.0%
Med.

231. Power of Two
50.1%
Easy

354. Russian Doll Envelopes
37.9%
Hard

1470. Shuffle the Array
88.8%
Easy

58. Length of Last Word
58.9%
Easy

72. Edit Distance
60.7%
Med.

268. Missing Number
72.1%
Easy

977. Squares of a Sorted Array
73.8%
Easy

1480. Running Sum of 1d Array
87.0%
Easy

2235. Add Two Integers
88.0%
Easy

32. Longest Valid Parentheses
38.9%
Hard

152. Maximum Product Subarray
36.5%
Med.

234. Palindrome Linked List
58.1%
Easy

322. Coin Change
48.5%
Med.

344. Reverse String
80.9%
Easy

345. Reverse Vowels of a String
61.4%
Easy

448. Find All Numbers Disappeared in an Array
64.2%
Easy

503. Next Greater Element II
68.5%
Med.

509. Fibonacci Number
74.2%
Easy

645. Set Mismatch
43.5%
Easy

876. Middle of the Linked List
81.9%
Easy

8. String to Integer (atoi)
21.1%
Med.

16. 3Sum Closest
48.7%
Med.

39. Combination Sum
76.6%
Med.

69. Sqrt(x)
41.9%
Easy

74. Search a 2D Matrix
54.0%
Med.

102. Binary Tree Level Order Traversal
72.8%
Med.

155. Min Stack
58.2%
Med.

160. Intersection of Two Linked Lists
63.8%
Easy

777. Swap Adjacent in LR String
38.2%
Med.

6. Zigzag Conversion
54.2%
Med.

25. Reverse Nodes in k-Group
66.2%
Hard

37. Sudoku Solver
65.5%
Hard

41. First Missing Positive
43.0%
Hard

57. Insert Interval
45.3%
Med.

62. Unique Paths
66.9%
Med.

83. Remove Duplicates from Sorted List
56.8%
Easy

151. Reverse Words in a String
56.6%
Med.

179. Largest Number
43.1%
Med.

181. Employees Earning More Than Their Managers
73.3%
Easy

205. Isomorphic Strings
48.5%
Easy

383. Ransom Note
66.0%
Easy

778. Swim in Rising Water
67.9%
Hard

994. Rotting Oranges
58.7%
Med.

1752. Check if Array Is Sorted and Rotated
57.4%
Easy

50. Pow(x, n)
38.7%
Med.

130. Surrounded Regions
45.4%
Med.

139. Word Break
49.5%
Med.

141. Linked List Cycle
54.4%
Easy

204. Count Primes
36.1%
Med.

219. Contains Duplicate II
51.4%
Easy

224. Basic Calculator
46.9%
Hard

380. Insert Delete GetRandom O(1)
55.4%
Med.

387. First Unique Character in a String
65.6%
Easy

496. Next Greater Element I
76.2%
Easy

643. Maximum Average Subarray I
47.9%
Easy

743. Network Delay Time
60.6%
Med.

904. Fruit Into Baskets
51.3%
Med.

1922. Count Good Numbers
57.7%
Med.

19. Remove Nth Node From End of List
51.7%
Med.

29. Divide Two Integers
19.8%
Med.

45. Jump Game II
43.0%
Med.

80. Remove Duplicates from Sorted Array II
64.8%
Med.

90. Subsets II
61.4%
Med.

122. Best Time to Buy and Sell Stock II
71.2%
Med.

127. Word Ladder
45.7%
Hard

137. Single Number II
67.2%
Med.

197. Rising Temperature
51.4%
Easy

209. Minimum Size Subarray Sum
51.8%
Med.

287. Find the Duplicate Number
64.4%
Med.

295. Find Median from Data Stream
54.5%
Hard

414. Third Maximum Number
39.5%
Easy

443. String Compression
60.1%
Med.

518. Coin Change II
59.9%
Med.

739. Daily Temperatures
68.7%
Med.

799. Champagne Tower
64.1%
Med.

1148. Article Views I
76.6%
Easy

3453. Separate Squares I
58.0%
Med.

61. Rotate List
42.7%
Med.

73. Set Matrix Zeroes
63.1%
Med.

176. Second Highest Salary
47.2%
Med.

190. Reverse Bits
68.5%
Easy

221. Maximal Square
50.4%
Med.

236. Lowest Common Ancestor of a Binary Tree
69.4%
Med.

240. Search a 2D Matrix II
57.4%
Med.

278. First Bad Version
47.2%
Easy

442. Find All Duplicates in an Array
77.0%
Med.

595. Big Countries
68.5%
Easy

621. Task Scheduler
63.2%
Med.

703. Kth Largest Element in a Stream
61.1%
Easy

746. Min Cost Climbing Stairs
68.3%
Easy

787. Cheapest Flights Within K Stops
41.9%
Med.

1094. Car Pooling
56.4%
Med.

1101. The Earliest Moment When Everyone Become Friends
66.1%
Med.

1838. Frequency of the Most Frequent Element
44.9%
Med.

2965. Find Missing and Repeated Values
83.1%
Easy

3637. Trionic Array I
49.5%
Easy

12. Integer to Roman
71.1%
Med.

24. Swap Nodes in Pairs
69.6%
Med.

60. Permutation Sequence
53.2%
Hard

68. Text Justification
51.3%
Hard

79. Word Search
47.5%
Med.

124. Binary Tree Maximum Path Sum
42.4%
Hard

131. Palindrome Partitioning
74.1%
Med.

210. Course Schedule II
55.6%
Med.

232. Implement Queue using Stacks
69.9%
Easy

304. Range Sum Query 2D - Immutable
58.4%
Med.

329. Longest Increasing Path in a Matrix
56.7%
Hard

416. Partition Equal Subset Sum
49.5%
Med.

455. Assign Cookies
55.0%
Easy

528. Random Pick with Weight
49.1%
Med.

547. Number of Provinces
70.5%
Med.

733. Flood Fill
68.3%
Easy

767. Reorganize String
57.1%
Med.

815. Bus Routes
47.3%
Hard

833. Find And Replace in String
50.8%
Med.

843. Guess the Word
36.7%
Hard

844. Backspace String Compare
49.9%
Easy

907. Sum of Subarray Minimums
38.6%
Med.

992. Subarrays with K Different Integers
68.2%
Hard

1011. Capacity To Ship Packages Within D Days
74.0%
Med.

2149. Rearrange Array Elements by Sign
84.7%
Med.

2337. Move Pieces to Obtain a String
56.6%
Med.

2619. Array Prototype Last
74.7%
Easy

3635. Earliest Finish Time for Land and Water Rides II
64.2%
Med.

3721. Longest Balanced Subarray II
33.8%
Hard

44. Wildcard Matching
32.1%
Hard

71. Simplify Path
50.7%
Med.

92. Reverse Linked List II
51.6%
Med.

98. Validate Binary Search Tree
35.8%
Med.

103. Binary Tree Zigzag Level Order Traversal
63.8%
Med.

104. Maximum Depth of Binary Tree
78.2%
Easy

105. Construct Binary Tree from Preorder and Inorder Traversal
68.9%
Med.

110. Balanced Binary Tree
58.5%
Easy

126. Word Ladder II
27.7%
Hard

133. Clone Graph
65.4%
Med.

153. Find Minimum in Rotated Sorted Array
54.8%
Med.

168. Excel Sheet Column Title
46.6%
Easy

183. Customers Who Never Order
71.8%
Easy

196. Delete Duplicate Emails
66.1%
Easy

226. Invert Binary Tree
80.1%
Easy

249. Group Shifted Strings
67.8%
Med.

258. Add Digits
69.0%
Easy

303. Range Sum Query - Immutable
72.3%
Easy

350. Intersection of Two Arrays II
60.0%
Easy

371. Sum of Two Integers
55.6%
Med.

392. Is Subsequence
49.1%
Easy

412. Fizz Buzz
75.5%
Easy

417. Pacific Atlantic Water Flow
61.0%
Med.

437. Path Sum III
46.4%
Med.

494. Target Sum
52.3%
Med.

577. Employee Bonus
77.5%
Easy

662. Maximum Width of Binary Tree
45.7%
Med.

715. Range Module
45.1%
Hard

735. Asteroid Collision
48.0%
Med.

796. Rotate String
66.7%
Easy

961. N-Repeated Element in Size 2N Array
79.9%
Easy

981. Time Based Key-Value Store
50.0%
Med.

1071. Greatest Common Divisor of Strings
53.8%
Easy

1137. N-th Tribonacci Number
63.2%
Easy

1143. Longest Common Subsequence
59.2%
Med.

1339. Maximum Product of Splitted Binary Tree
55.7%
Med.

1415. The k-th Lexicographical String of All Happy Strings of Length n
87.1%
Med.

1539. Kth Missing Positive Number
63.5%
Easy

1877. Minimize Maximum Pair Sum in Array
83.3%
Med.

1975. Maximum Matrix Sum
67.5%
Med.

2035. Partition Array Into Two Arrays to Minimize Sum Difference
23.5%
Hard

2574. Left and Right Sum Differences
89.6%
Easy

2657. Find the Prefix Common Array of Two Arrays
88.3%
Med.

3010. Divide an Array Into Subarrays With Minimum Cost I
80.6%
Easy

3225. Maximum Score From Grid Operations
64.4%
Hard

3481. Apply Substitutions
77.6%
Med.

3738. Longest Non-Decreasing Subarray After Replacing at Most One Element
22.3%
Med.

3742. Maximum Path Score in a Grid
53.8%
Med.

23. Merge k Sorted Lists
59.7%
Hard

30. Substring with Concatenation of All Words
34.5%
Hard

36. Valid Sudoku
64.6%
Med.

43. Multiply Strings
44.2%
Med.

47. Permutations II
63.5%
Med.

76. Minimum Window Substring
47.7%
Hard

94. Binary Tree Inorder Traversal
80.1%
Easy

99. Recover Binary Search Tree
59.8%
Med.

109. Convert Sorted List to Binary Search Tree
66.7%
Med.

134. Gas Station
48.1%
Med.

135. Candy
48.5%
Hard

138. Copy List with Random Pointer
63.0%
Med.

142. Linked List Cycle II
58.1%
Med.

143. Reorder List
65.4%
Med.

150. Evaluate Reverse Polish Notation
57.9%
Med.

213. House Robber II
45.0%
Med.

233. Number of Digit One
38.9%
Hard

312. Burst Balloons
63.6%
Hard

319. Bulb Switcher
56.0%
Med.

328. Odd Even Linked List
62.6%
Med.

337. House Robber III
56.0%
Med.

438. Find All Anagrams in a String
53.9%
Med.

444. Sequence Reconstruction
30.9%
Med.

459. Repeated Substring Pattern
48.3%
Easy

525. Contiguous Array
51.5%
Med.

567. Permutation in String
49.0%
Med.

570. Managers with at Least 5 Direct Reports
49.1%
Med.

636. Exclusive Time of Functions
66.2%
Med.

658. Find K Closest Elements
49.7%
Med.

678. Valid Parenthesis String
40.2%
Med.

680. Valid Palindrome II
44.3%
Easy

714. Best Time to Buy and Sell Stock with Transaction Fee
72.1%
Med.

761. Special Binary String
79.4%
Hard

930. Binary Subarrays With Sum
69.0%
Med.

933. Number of Recent Calls
78.5%
Easy

974. Subarray Sums Divisible by K
56.3%
Med.

1021. Remove Outermost Parentheses
87.1%
Easy

1047. Remove All Adjacent Duplicates In String
73.3%
Easy

1075. Project Employees I
66.8%
Easy

1161. Maximum Level Sum of a Binary Tree
70.0%
Med.

1200. Minimum Absolute Difference
75.1%
Easy

1207. Unique Number of Occurrences
78.7%
Easy

1296. Divide Array in Sets of K Consecutive Numbers
59.3%
Med.

1461. Check If a String Contains All Binary Codes of Size K
61.6%
Med.

1512. Number of Good Pairs
89.8%
Easy

1545. Find Kth Bit in Nth Binary String
73.7%
Med.

1722. Minimize Hamming Distance After Swap Operations
69.7%
Med.

1727. Largest Submatrix With Rearrangements
80.2%
Med.

1970. Last Day Where You Can Still Cross
68.7%
Hard

1971. Find if Path Exists in Graph
55.2%
Easy

2396. Strictly Palindromic Number
90.3%
Med.

2620. Counter
82.4%
Easy

3043. Find the Length of the Longest Common Prefix
62.2%
Med.

3121. Count the Number of Special Characters II
60.3%
Med.

3161. Block Placement Queries
41.5%
Hard

40. Combination Sum II
59.5%
Med.

77. Combinations
74.6%
Med.

81. Search in Rotated Sorted Array II
40.1%
Med.

86. Partition List
61.3%
Med.

97. Interleaving String
44.1%
Med.

101. Symmetric Tree
61.3%
Easy

120. Triangle
59.9%
Med.

148. Sort List
64.6%
Med.

178. Rank Scores
67.9%
Med.

182. Duplicate Emails
73.8%
Easy

191. Number of 1 Bits
76.9%
Easy

199. Binary Tree Right Side View
70.3%
Med.

208. Implement Trie (Prefix Tree)
69.6%
Med.

225. Implement Stack using Queues
70.0%
Easy

228. Summary Ranges
54.3%
Easy

230. Kth Smallest Element in a BST
76.9%
Med.

235. Lowest Common Ancestor of a Binary Search Tree
70.7%
Med.

257. Binary Tree Paths
68.7%
Easy

263. Ugly Number
43.6%
Easy

279. Perfect Squares
56.6%
Med.

315. Count of Smaller Numbers After Self
43.7%
Hard

367. Valid Perfect Square
45.0%
Easy

377. Combination Sum IV
55.1%
Med.

399. Evaluate Division
64.3%
Med.

402. Remove K Digits
37.0%
Med.

407. Trapping Rain Water II
64.1%
Hard

450. Delete Node in a BST
54.8%
Med.

460. LFU Cache
49.4%
Hard

507. Perfect Number
49.0%
Easy

511. Game Play Analysis I
76.4%
Easy

542. 01 Matrix
54.0%
Med.

543. Diameter of Binary Tree
65.6%
Easy

572. Subtree of Another Tree
51.7%
Easy

605. Can Place Flowers
29.2%
Easy

622. Design Circular Queue
54.8%
Med.

642. Design Search Autocomplete System
50.0%
Hard

707. Design Linked List
30.3%
Med.

713. Subarray Product Less Than K
54.4%
Med.

721. Accounts Merge
61.4%
Med.

728. Self Dividing Numbers
80.9%
Easy

811. Subdomain Visit Count
77.2%
Med.

834. Sum of Distances in Tree
65.6%
Hard

868. Binary Gap
74.3%
Easy

901. Online Stock Span
69.1%
Med.

931. Minimum Falling Path Sum
60.8%
Med.

934. Shortest Bridge
59.5%
Med.

939. Minimum Area Rectangle
55.5%
Med.

944. Delete Columns to Make Sorted
78.1%
Easy

956. Tallest Billboard
51.9%
Hard

1009. Complement of Base 10 Integer
63.4%
Easy

1043. Partition Array for Maximum Sum
77.4%
Med.

1044. Longest Duplicate Substring
31.2%
Hard

1110. Delete Nodes And Return Forest
72.5%
Med.

1193. Monthly Transactions I
59.2%
Med.

1277. Count Square Submatrices with All Ones
80.7%
Med.

1283. Find the Smallest Divisor Given a Threshold
66.1%
Med.

1292. Maximum Side Length of a Square with Sum Less than or Equal to Threshold
65.4%
Med.

1340. Jump Game V
75.8%
Hard

1351. Count Negative Numbers in a Sorted Matrix
79.6%
Easy

1358. Number of Substrings Containing All Three Characters
73.8%
Med.

1441. Build an Array With Stack Operations
80.9%
Med.

1482. Minimum Number of Days to Make m Bouquets
56.6%
Med.

1581. Customer Who Visited but Did Not Make Any Transactions
67.7%
Easy

1584. Min Cost to Connect All Points
71.0%
Med.

1603. Design Parking System
87.2%
Easy

1653. Minimum Deletions to Make String Balanced
68.2%
Med.

1665. Minimum Initial Energy to Finish Tasks
76.4%
Hard

2110. Number of Smooth Descent Periods of a Stock
67.7%
Med.

2188. Minimum Time to Finish the Race
43.4%
Hard

2540. Minimum Common Value
60.8%
Easy

2553. Separate the Digits in an Array
85.8%
Easy

2784. Check if Array is Good
57.2%
Easy

2975. Maximum Square Area by Removing Fences From a Field
49.5%
Med.

3026. Maximum Good Subarray Sum
22.0%
Med.

3074. Apple Redistribution into Boxes
78.6%
Easy

3129. Find All Possible Stable Binary Arrays I
53.6%
Med.

3474. Lexicographically Smallest Generated String
53.5%
Hard

3546. Equal Sum Grid Partition I
52.9%
Med.

3600. Maximize Spanning Tree Stability with Upgrades
66.3%
Hard

3634. Minimum Removals to Balance Array
47.9%
Med.

3651. Minimum Cost Path with Teleportations
45.5%
Hard

3660. Jump Game IX
46.3%
Med.

38. Count and Say
63.0%
Med.
`;

const googleRecentQuestions = parseQuestionFeed(googleRecentQuestionFeed);
const mergedGoogleQuestions = mergeQuestionFeeds(
  rawQuestionsByCompany.Google,
  googleRecentQuestions,
);

const amazonRecentQuestionFeed = `
1. Two Sum
57.6%
Easy

42. Trapping Rain Water
67.5%
Hard

3. Longest Substring Without Repeating Characters
39.2%
Med.

146. LRU Cache
47.4%
Med.

121. Best Time to Buy and Sell Stock
56.9%
Easy

2. Add Two Numbers
48.6%
Med.

11. Container With Most Water
60.1%
Med.

15. 3Sum
39.2%
Med.

200. Number of Islands
64.5%
Med.

4. Median of Two Sorted Arrays
46.7%
Hard

23. Merge k Sorted Lists
59.7%
Hard

56. Merge Intervals
52.0%
Med.

560. Subarray Sum Equals K
47.4%
Med.

49. Group Anagrams
72.7%
Med.

5. Longest Palindromic Substring
37.9%
Med.

207. Course Schedule
51.5%
Med.

994. Rotting Oranges
58.7%
Med.

33. Search in Rotated Sorted Array
45.0%
Med.

14. Longest Common Prefix
47.7%
Easy

875. Koko Eating Bananas
50.1%
Med.

9. Palindrome Number
60.6%
Easy

22. Generate Parentheses
78.7%
Med.

236. Lowest Common Ancestor of a Binary Tree
69.4%
Med.

128. Longest Consecutive Sequence
47.1%
Med.

767. Reorganize String
57.1%
Med.

1929. Concatenation of Array
90.3%
Easy

17. Letter Combinations of a Phone Number
66.2%
Med.

169. Majority Element
66.3%
Easy

20. Valid Parentheses
44.3%
Easy

21. Merge Two Sorted Lists
68.4%
Easy

70. Climbing Stairs
54.1%
Easy

18. 4Sum
40.8%
Med.

735. Asteroid Collision
48.0%
Med.

904. Fruit Into Baskets
51.3%
Med.

53. Maximum Subarray
53.4%
Med.

198. House Robber
53.3%
Med.

1004. Max Consecutive Ones III
67.8%
Med.

31. Next Permutation
45.4%
Med.

62. Unique Paths
66.9%
Med.

69. Sqrt(x)
41.9%
Easy

75. Sort Colors
69.7%
Med.

424. Longest Repeating Character Replacement
59.8%
Med.

26. Remove Duplicates from Sorted Array
62.9%
Easy

28. Find the Index of the First Occurrence in a String
46.7%
Easy

138. Copy List with Random Pointer
63.0%
Med.

78. Subsets
82.4%
Med.

136. Single Number
77.8%
Easy

143. Reorder List
65.4%
Med.

217. Contains Duplicate
64.4%
Easy

234. Palindrome Linked List
58.1%
Easy

242. Valid Anagram
68.2%
Easy

347. Top K Frequent Elements
66.6%
Med.

27. Remove Element
61.9%
Easy

35. Search Insert Position
51.4%
Easy

48. Rotate Image
80.2%
Med.

55. Jump Game
41.0%
Med.

127. Word Ladder
45.7%
Hard

54. Spiral Matrix
56.9%
Med.

118. Pascal's Triangle
79.0%
Easy

162. Find Peak Element
47.0%
Med.

239. Sliding Window Maximum
48.8%
Hard

621. Task Scheduler
63.2%
Med.

6. Zigzag Conversion
54.2%
Med.

41. First Missing Positive
43.0%
Hard

155. Min Stack
58.2%
Med.

238. Product of Array Except Self
68.9%
Med.

283. Move Zeroes
63.9%
Easy

16. 3Sum Closest
48.7%
Med.

19. Remove Nth Node From End of List
51.7%
Med.

34. Find First and Last Position of Element in Sorted Array
49.0%
Med.

66. Plus One
50.0%
Easy

76. Minimum Window Substring
47.7%
Hard

139. Word Break
49.5%
Med.

176. Second Highest Salary
47.2%
Med.

215. Kth Largest Element in an Array
69.0%
Med.

253. Meeting Rooms II
52.7%
Med.

1011. Capacity To Ship Packages Within D Days
74.0%
Med.

7. Reverse Integer
32.0%
Med.

51. N-Queens
75.7%
Hard

88. Merge Sorted Array
55.0%
Easy

125. Valid Palindrome
53.4%
Easy

175. Combine Two Tables
79.6%
Easy

287. Find the Duplicate Number
64.4%
Med.

8. String to Integer (atoi)
21.1%
Med.

36. Valid Sudoku
64.6%
Med.

45. Jump Game II
43.0%
Med.

46. Permutations
82.0%
Med.

79. Word Search
47.5%
Med.

199. Binary Tree Right Side View
70.3%
Med.

387. First Unique Character in a String
65.6%
Easy

496. Next Greater Element I
76.2%
Easy

540. Single Element in a Sorted Array
59.3%
Med.

739. Daily Temperatures
68.7%
Med.

796. Rotate String
66.7%
Easy

852. Peak Index in a Mountain Array
66.8%
Med.

907. Sum of Subarray Minimums
38.6%
Med.

1648. Sell Diminishing-Valued Colored Balls
30.2%
Med.

73. Set Matrix Zeroes
63.1%
Med.

74. Search a 2D Matrix
54.0%
Med.

98. Validate Binary Search Tree
35.8%
Med.

122. Best Time to Buy and Sell Stock II
71.2%
Med.

142. Linked List Cycle II
58.1%
Med.

189. Rotate Array
45.0%
Med.

210. Course Schedule II
55.6%
Med.

240. Search a 2D Matrix II
57.4%
Med.

295. Find Median from Data Stream
54.5%
Hard

322. Coin Change
48.5%
Med.

981. Time Based Key-Value Store
50.0%
Med.

1752. Check if Array Is Sorted and Rotated
57.4%
Easy

58. Length of Last Word
58.9%
Easy

84. Largest Rectangle in Histogram
50.0%
Hard

110. Balanced Binary Tree
58.5%
Easy

124. Binary Tree Maximum Path Sum
42.4%
Hard

152. Maximum Product Subarray
36.5%
Med.

204. Count Primes
36.1%
Med.

349. Intersection of Two Arrays
77.8%
Easy

493. Reverse Pairs
34.4%
Hard

543. Diameter of Binary Tree
65.6%
Easy

658. Find K Closest Elements
49.7%
Med.

1482. Minimum Number of Days to Make m Bouquets
56.6%
Med.

1757. Recyclable and Low Fat Products
88.6%
Easy

3010. Divide an Array Into Subarrays With Minimum Cost I
80.6%
Easy

32. Longest Valid Parentheses
38.9%
Hard

38. Count and Say
63.0%
Med.

50. Pow(x, n)
38.7%
Med.

135. Candy
48.5%
Hard

179. Largest Number
43.1%
Med.

209. Minimum Size Subarray Sum
51.8%
Med.

297. Serialize and Deserialize Binary Tree
60.8%
Hard

300. Longest Increasing Subsequence
59.5%
Med.

328. Odd Even Linked List
62.6%
Med.

394. Decode String
62.7%
Med.

410. Split Array Largest Sum
60.6%
Hard

435. Non-overlapping Intervals
57.2%
Med.

443. String Compression
60.1%
Med.

485. Max Consecutive Ones
65.3%
Easy

503. Next Greater Element II
68.5%
Med.

977. Squares of a Sorted Array
73.8%
Easy

987. Vertical Order Traversal of a Binary Tree
53.9%
Hard

10. Regular Expression Matching
31.0%
Hard

12. Integer to Roman
71.1%
Med.

13. Roman to Integer
66.7%
Easy

61. Rotate List
42.7%
Med.

67. Add Binary
58.1%
Easy

83. Remove Duplicates from Sorted List
56.8%
Easy

100. Same Tree
67.2%
Easy

153. Find Minimum in Rotated Sorted Array
54.8%
Med.

160. Intersection of Two Linked Lists
63.8%
Easy

202. Happy Number
59.7%
Easy

258. Add Digits
69.0%
Easy

380. Insert Delete GetRandom O(1)
55.4%
Med.

416. Partition Equal Subset Sum
49.5%
Med.

455. Assign Cookies
55.0%
Easy

472. Concatenated Words
49.8%
Hard

509. Fibonacci Number
74.2%
Easy

863. All Nodes Distance K in Binary Tree
67.7%
Med.

992. Subarrays with K Different Integers
68.2%
Hard

1539. Kth Missing Positive Number
63.5%
Easy

2385. Amount of Time for Binary Tree to Be Infected
65.5%
Med.

2488. Count Subarrays With Median K
48.9%
Hard

3752. Lexicographically Smallest Negated Permutation that Sums to Target
31.4%
Med.

3914. Minimum Operations to Make Array Non Decreasing
55.3%
Med.

39. Combination Sum
76.6%
Med.

63. Unique Paths II
44.6%
Med.

86. Partition List
61.3%
Med.

97. Interleaving String
44.1%
Med.

102. Binary Tree Level Order Traversal
72.8%
Med.

134. Gas Station
48.1%
Med.

141. Linked List Cycle
54.4%
Easy

151. Reverse Words in a String
56.6%
Med.

181. Employees Earning More Than Their Managers
73.3%
Easy

205. Isomorphic Strings
48.5%
Easy

212. Word Search II
38.5%
Hard

219. Contains Duplicate II
51.4%
Easy

224. Basic Calculator
46.9%
Hard

268. Missing Number
72.1%
Easy

344. Reverse String
80.9%
Easy

567. Permutation in String
49.0%
Med.

680. Valid Palindrome II
44.3%
Easy

696. Count Binary Substrings
70.4%
Easy

704. Binary Search
60.9%
Easy

733. Flood Fill
68.3%
Easy

876. Middle of the Linked List
81.9%
Easy

881. Boats to Save People
61.9%
Med.

901. Online Stock Span
69.1%
Med.

1480. Running Sum of 1d Array
87.0%
Easy

2910. Minimum Number of Groups to Create a Valid Assignment
25.3%
Med.

3872. Longest Arithmetic Sequence After Changing At Most One Element
21.3%
Med.

25. Reverse Nodes in k-Group
66.2%
Hard

85. Maximal Rectangle
58.9%
Hard

94. Binary Tree Inorder Traversal
80.1%
Easy

101. Symmetric Tree
61.3%
Easy

148. Sort List
64.6%
Med.

150. Evaluate Reverse Polish Notation
57.9%
Med.

167. Two Sum II - Input Array Is Sorted
65.2%
Med.

190. Reverse Bits
68.5%
Easy

197. Rising Temperature
51.4%
Easy

206. Reverse Linked List
80.6%
Easy

274. H-Index
41.5%
Med.

278. First Bad Version
47.2%
Easy

354. Russian Doll Envelopes
37.9%
Hard

383. Ransom Note
66.0%
Easy

451. Sort Characters By Frequency
75.4%
Med.

456. 132 Pattern
34.8%
Med.

460. LFU Cache
49.4%
Hard

528. Random Pick with Weight
49.1%
Med.

547. Number of Provinces
70.5%
Med.

636. Exclusive Time of Functions
66.2%
Med.

645. Set Mismatch
43.5%
Easy

692. Top K Frequent Words
60.2%
Med.

698. Partition to K Equal Sum Subsets
38.7%
Med.

815. Bus Routes
47.3%
Hard

840. Magic Squares In Grid
55.2%
Med.

931. Minimum Falling Path Sum
60.8%
Med.

1021. Remove Outermost Parentheses
87.1%
Easy

1470. Shuffle the Array
88.8%
Easy

1768. Merge Strings Alternately
82.1%
Easy

1848. Minimum Distance to the Target Element
64.5%
Easy

1903. Largest Odd Number in String
67.5%
Easy

2235. Add Two Integers
88.0%
Easy

2667. Create Hello World Function
81.9%
Easy

2965. Find Missing and Repeated Values
83.1%
Easy

3413. Maximum Coins From K Consecutive Bags
24.8%
Med.

24. Swap Nodes in Pairs
69.6%
Med.

43. Multiply Strings
44.2%
Med.

57. Insert Interval
45.3%
Med.

99. Recover Binary Search Tree
59.8%
Med.

103. Binary Tree Zigzag Level Order Traversal
63.8%
Med.

130. Surrounded Regions
45.4%
Med.

133. Clone Graph
65.4%
Med.

137. Single Number II
67.2%
Med.

140. Word Break II
55.6%
Hard

149. Max Points on a Line
30.8%
Hard

165. Compare Version Numbers
46.5%
Med.

174. Dungeon Game
41.4%
Hard

178. Rank Scores
67.9%
Med.

182. Duplicate Emails
73.8%
Easy

183. Customers Who Never Order
71.8%
Easy

203. Remove Linked List Elements
54.6%
Easy

213. House Robber II
45.0%
Med.

312. Burst Balloons
63.6%
Hard

345. Reverse Vowels of a String
61.4%
Easy

371. Sum of Two Integers
55.6%
Med.

396. Rotate Function
54.2%
Med.

399. Evaluate Division
64.3%
Med.

412. Fizz Buzz
75.5%
Easy

541. Reverse String II
53.9%
Easy

557. Reverse Words in a String III
84.0%
Easy

570. Managers with at Least 5 Direct Reports
49.1%
Med.

595. Big Countries
68.5%
Easy

605. Can Place Flowers
29.2%
Easy

622. Design Circular Queue
54.8%
Med.

721. Accounts Merge
61.4%
Med.

752. Open the Lock
61.3%
Med.

853. Car Fleet
55.2%
Med.

983. Minimum Cost For Tickets
67.4%
Med.

1070. Product Sales Analysis III
46.1%
Med.

1148. Article Views I
76.6%
Easy

1152. Analyze User Website Visit Pattern
44.3%
Med.

1161. Maximum Level Sum of a Binary Tree
70.0%
Med.

1280. Students and Examinations
61.3%
Easy

1283. Find the Smallest Divisor Given a Threshold
66.1%
Med.

1382. Balance a Binary Search Tree
86.3%
Med.

1438. Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit
57.7%
Med.

1458. Max Dot Product of Two Subsequences
69.4%
Hard

1559. Detect Cycles in 2D Grid
63.3%
Med.

1665. Minimum Initial Energy to Finish Tasks
76.4%
Hard

1861. Rotating the Box
82.5%
Med.

1871. Jump Game VII
35.6%
Med.

1971. Find if Path Exists in Graph
55.2%
Easy

2149. Rearrange Array Elements by Sign
84.7%
Med.

2196. Create Binary Tree From Descriptions
83.9%
Med.

2657. Find the Prefix Common Array of Two Arrays
88.3%
Med.

3043. Find the Length of the Longest Common Prefix
62.2%
Med.

3434. Maximum Frequency After Subarray Operation
31.3%
Med.

3635. Earliest Finish Time for Land and Water Rides II
64.2%
Med.

3751. Total Waviness of Numbers in Range I
87.5%
Med.

3785. Minimum Swaps to Avoid Forbidden Values
30.8%
Hard

29. Divide Two Integers
19.8%
Med.

30. Substring with Concatenation of All Words
34.5%
Hard

37. Sudoku Solver
65.5%
Hard

44. Wildcard Matching
32.1%
Hard

59. Spiral Matrix II
75.1%
Med.

64. Minimum Path Sum
68.3%
Med.

71. Simplify Path
50.7%
Med.

72. Edit Distance
60.7%
Med.

80. Remove Duplicates from Sorted Array II
64.8%
Med.

81. Search in Rotated Sorted Array II
40.1%
Med.

104. Maximum Depth of Binary Tree
78.2%
Easy

105. Construct Binary Tree from Preorder and Inorder Traversal
68.9%
Med.

120. Triangle
59.9%
Med.

126. Word Ladder II
27.7%
Hard

131. Palindrome Partitioning
74.1%
Med.

168. Excel Sheet Column Title
46.6%
Easy

221. Maximal Square
50.4%
Med.

231. Power of Two
50.1%
Easy

232. Implement Queue using Stacks
69.9%
Easy

263. Ugly Number
43.6%
Easy

269. Alien Dictionary
37.2%
Hard

273. Integer to English Words
35.0%
Hard

304. Range Sum Query 2D - Immutable
58.4%
Med.

319. Bulb Switcher
56.0%
Med.

337. House Robber III
56.0%
Med.

359. Logger Rate Limiter
76.8%
Easy

392. Is Subsequence
49.1%
Easy

402. Remove K Digits
37.0%
Med.

417. Pacific Atlantic Water Flow
61.0%
Med.

430. Flatten a Multilevel Doubly Linked List
63.0%
Med.

643. Maximum Average Subarray I
47.9%
Easy

678. Valid Parenthesis String
40.2%
Med.

743. Network Delay Time
60.6%
Med.

746. Min Cost Climbing Stairs
68.3%
Easy

787. Cheapest Flights Within K Stops
41.9%
Med.

799. Champagne Tower
64.1%
Med.

802. Find Eventual Safe States
70.8%
Med.

874. Walking Robot Simulation
64.6%
Med.

921. Minimum Add to Make Parentheses Valid
74.4%
Med.

930. Binary Subarrays With Sum
69.0%
Med.

933. Number of Recent Calls
78.5%
Easy

947. Most Stones Removed with Same Row or Column
63.0%
Med.

1008. Construct Binary Search Tree from Preorder Traversal
84.3%
Med.

1046. Last Stone Weight
66.5%
Easy

1091. Shortest Path in Binary Matrix
51.6%
Med.

1143. Longest Common Subsequence
59.2%
Med.

1192. Critical Connections in a Network
59.8%
Hard

1268. Search Suggestions System
65.2%
Med.

1319. Number of Operations to Make Network Connected
66.6%
Med.

1423. Maximum Points You Can Obtain from Cards
57.8%
Med.

1475. Final Prices With a Special Discount in a Shop
84.2%
Easy

1650. Lowest Common Ancestor of a Binary Tree III
83.0%
Med.

1674. Minimum Moves to Make Array Complementary
65.0%
Med.

1838. Frequency of the Most Frequent Element
44.9%
Med.

1980. Find Unique Binary String
81.2%
Med.

2050. Parallel Courses III
66.8%
Hard

2483. Minimum Penalty for a Shop
71.2%
Med.

2703. Return Length of Arguments Passed
94.5%
Easy

3379. Transformed Array
70.5%
Easy

3453. Separate Squares I
58.0%
Med.

3510. Minimum Pair Removal to Sort Array II
39.0%
Hard

3633. Earliest Finish Time for Land and Water Rides I
72.9%
Easy

3650. Minimum Cost Path with Edge Reversals
61.8%
Med.

3920. Maximize Fixed Points After Deletions
19.3%
Hard

60. Permutation Sequence
53.2%
Hard

90. Subsets II
61.4%
Med.

92. Reverse Linked List II
51.6%
Med.

93. Restore IP Addresses
56.1%
Med.

111. Minimum Depth of Binary Tree
53.0%
Easy

114. Flatten Binary Tree to Linked List
70.8%
Med.

123. Best Time to Buy and Sell Stock III
53.8%
Hard

177. Nth Highest Salary
39.3%
Med.

180. Consecutive Numbers
48.5%
Med.

184. Department Highest Salary
58.2%
Med.

211. Design Add and Search Words Data Structure
48.6%
Med.

214. Shortest Palindrome
42.5%
Hard

225. Implement Stack using Queues
70.0%
Easy

226. Invert Binary Tree
80.1%
Easy

228. Summary Ranges
54.3%
Easy

235. Lowest Common Ancestor of a Binary Search Tree
70.7%
Med.

237. Delete Node in a Linked List
83.9%
Med.

252. Meeting Rooms
59.5%
Easy

279. Perfect Squares
56.6%
Med.

299. Bulls and Cows
52.5%
Med.

316. Remove Duplicate Letters
53.3%
Med.

348. Design Tic-Tac-Toe
58.7%
Med.

389. Find the Difference
60.4%
Easy

390. Elimination Game
46.4%
Med.

391. Perfect Rectangle
38.1%
Hard

395. Longest Substring with At Least K Repeating Characters
46.3%
Med.

403. Frog Jump
47.3%
Hard

415. Add Strings
52.2%
Easy

419. Battleships in a Board
77.6%
Med.

438. Find All Anagrams in a String
53.9%
Med.

441. Arranging Coins
48.3%
Easy

502. IPO
53.5%
Hard

504. Base 7
54.6%
Easy

518. Coin Change II
59.9%
Med.

525. Contiguous Array
51.5%
Med.

530. Minimum Absolute Difference in BST
59.4%
Easy

584. Find Customer Referee
72.9%
Easy

599. Minimum Index Sum of Two Lists
59.9%
Easy

610. Triangle Judgement
74.8%
Easy

626. Exchange Seats
74.2%
Med.

653. Two Sum IV - Input is a BST
63.3%
Easy

662. Maximum Width of Binary Tree
45.7%
Med.

684. Redundant Connection
67.7%
Med.

695. Max Area of Island
74.0%
Med.

706. Design HashMap
66.6%
Easy

707. Design Linked List
30.3%
Med.

719. Find K-th Smallest Pair Distance
46.6%
Hard

763. Partition Labels
81.9%
Med.

785. Is Graph Bipartite?
59.4%
Med.

797. All Paths From Source to Target
83.6%
Med.

827. Making A Large Island
56.7%
Hard

860. Lemonade Change
59.1%
Easy

871. Minimum Number of Refueling Stops
41.5%
Hard

878. Nth Magical Number
36.8%
Hard

955. Delete Columns to Make Sorted II
49.7%
Med.

961. N-Repeated Element in Size 2N Array
79.9%
Easy

968. Binary Tree Cameras
47.9%
Hard

986. Interval List Intersections
73.0%
Med.

990. Satisfiability of Equality Equations
51.9%
Med.

1028. Recover a Tree From Preorder Traversal
83.2%
Hard

1043. Partition Array for Maximum Sum
77.4%
Med.

1047. Remove All Adjacent Duplicates In String
73.3%
Easy

1193. Monthly Transactions I
59.2%
Med.

1209. Remove All Adjacent Duplicates in String II
61.4%
Med.

1211. Queries Quality and Percentage
53.3%
Easy

1236. Web Crawler
68.9%
Med.

1277. Count Square Submatrices with All Ones
80.7%
Med.

1292. Maximum Side Length of a Square with Sum Less than or Equal to Threshold
65.4%
Med.

1293. Shortest Path in a Grid with Obstacles Elimination
46.4%
Hard

1353. Maximum Number of Events That Can Be Attended
39.0%
Med.

1365. How Many Numbers Are Smaller Than the Current Number
87.4%
Easy

1392. Longest Happy Prefix
53.2%
Hard

1429. First Unique Number
57.7%
Med.

1456. Maximum Number of Vowels in a Substring of Given Length
62.0%
Med.

1461. Check If a String Contains All Binary Codes of Size K
61.6%
Med.

1472. Design Browser History
78.3%
Med.

1494. Parallel Courses II
31.0%
Hard

1547. Minimum Cost to Cut a Stick
63.1%
Hard

1572. Matrix Diagonal Sum
84.3%
Easy

1581. Customer Who Visited but Did Not Make Any Transactions
67.7%
Easy

1584. Min Cost to Connect All Points
71.0%
Med.

1594. Maximum Non Negative Product in a Matrix
51.6%
Med.

1603. Design Parking System
87.2%
Easy

1622. Fancy Sequence
41.5%
Hard

1636. Sort Array by Increasing Frequency
80.8%
Easy

1642. Furthest Building You Can Reach
50.9%
Med.

1658. Minimum Operations to Reduce X to Zero
40.6%
Med.

1661. Average Time of Process per Machine
66.8%
Easy

1667. Fix Names in a Table
60.6%
Easy

1680. Concatenation of Consecutive Binary Numbers
66.6%
Med.

1685. Sum of Absolute Differences in a Sorted Array
68.4%
Med.

1700. Number of Students Unable to Eat Lunch
79.6%
Easy

1727. Largest Submatrix With Rearrangements
80.2%
Med.

1791. Find Center of Star Graph
86.6%
Easy

1856. Maximum Subarray Min-Product
40.4%
Med.

1895. Largest Magic Square
75.3%
Med.

1922. Count Good Numbers
57.7%
Med.

1934. Confirmation Rate
62.0%
Med.

1975. Maximum Matrix Sum
67.5%
Med.

2033. Minimum Operations to Make a Uni-Value Grid
70.7%
Med.

2144. Minimum Cost of Buying Candies With Discount
71.5%
Easy

2333. Minimum Sum of Squared Difference
26.9%
Med.

2384. Largest Palindromic Number
37.2%
Med.

2402. Meeting Rooms III
51.5%
Hard

2583. Kth Largest Sum in a Binary Tree
59.0%
Med.

2615. Sum of Distances
50.3%
Med.

2620. Counter
82.4%
Easy

2661. First Completely Painted Row or Column
63.9%
Med.

2770. Maximum Number of Jumps to Reach the Last Index
51.0%
Med.

2860. Happy Students
51.1%
Med.

2943. Maximize Area of Square Hole in Grid
61.9%
Med.

3013. Divide an Array Into Subarrays With Minimum Cost II
54.7%
Hard

3026. Maximum Good Subarray Sum
22.0%
Med.

3075. Maximize Happiness of Selected Children
58.7%
Med.

3120. Count the Number of Special Characters I
77.2%
Easy

3225. Maximum Score From Grid Operations
64.4%
Hard

3314. Construct the Minimum Bitwise Array I
85.2%
Easy

3315. Construct the Minimum Bitwise Array II
66.6%
Med.

3418. Maximum Amount of Money Robot Can Earn
47.8%
Med.

3454. Separate Squares II
59.4%
Hard

3483. Unique 3-Digit Even Numbers
69.9%
Easy

3488. Closest Equal Element Queries
51.4%
Med.

3629. Minimum Jumps to Reach End via Prime Teleportation
44.6%
Med.

3637. Trionic Array I
49.5%
Easy

3655. XOR After Range Multiplication Queries II
47.7%
Hard

3661. Maximum Walls Destroyed by Robots
48.0%
Hard

3713. Longest Balanced Substring I
69.7%
Med.

3721. Longest Balanced Subarray II
33.8%
Hard

3753. Total Waviness of Numbers in Range II
56.8%
Hard

3863. Minimum Operations to Sort a String
19.1%
Med.

65. Valid Number
23.1%
Hard

68. Text Justification
51.3%
Hard

89. Gray Code
65.0%
Med.

91. Decode Ways
38.1%
Med.

96. Unique Binary Search Trees
63.8%
Med.

106. Construct Binary Tree from Inorder and Postorder Traversal
68.8%
Med.

107. Binary Tree Level Order Traversal II
68.3%
Med.

109. Convert Sorted List to Binary Search Tree
66.7%
Med.

112. Path Sum
55.0%
Easy

113. Path Sum II
62.3%
Med.

116. Populating Next Right Pointers in Each Node
67.3%
Med.

154. Find Minimum in Rotated Sorted Array II
46.6%
Hard

171. Excel Sheet Column Number
67.8%
Easy

173. Binary Search Tree Iterator
76.5%
Med.

185. Department Top Three Salaries
60.6%
Hard

187. Repeated DNA Sequences
53.4%
Med.

193. Valid Phone Numbers
29.8%
Easy

208. Implement Trie (Prefix Tree)
69.6%
Med.

223. Rectangle Area
49.6%
Med.

227. Basic Calculator II
46.9%
Med.

229. Majority Element II
56.3%
Med.

256. Paint House
64.5%
Med.

260. Single Number III
70.3%
Med.

286. Walls and Gates
64.0%
Med.

290. Word Pattern
44.2%
Easy

301. Remove Invalid Parentheses
50.0%
Hard

303. Range Sum Query - Immutable
72.3%
Easy

309. Best Time to Buy and Sell Stock with Cooldown
62.2%
Med.

310. Minimum Height Trees
42.6%
Med.

313. Super Ugly Number
46.2%
Med.

315. Count of Smaller Numbers After Self
43.7%
Hard

318. Maximum Product of Word Lengths
61.3%
Med.

326. Power of Three
51.1%
Easy
`;

const amazonRecentQuestions = parseQuestionFeed(amazonRecentQuestionFeed);
const mergedAmazonQuestions = mergeQuestionFeeds(
  rawQuestionsByCompany.Amazon,
  amazonRecentQuestions,
);

const appleRecentQuestionFeed = `
146. LRU Cache
47.4%
Med.

362. Design Hit Counter
69.7%
Med.

56. Merge Intervals
52.0%
Med.

1. Two Sum
57.6%
Easy

210. Course Schedule II
55.6%
Med.

206. Reverse Linked List
80.6%
Easy

200. Number of Islands
64.5%
Med.

49. Group Anagrams
72.7%
Med.

380. Insert Delete GetRandom O(1)
55.4%
Med.

7. Reverse Integer
32.0%
Med.

14. Longest Common Prefix
47.7%
Easy

34. Find First and Last Position of Element in Sorted Array
49.0%
Med.

207. Course Schedule
51.5%
Med.

227. Basic Calculator II
46.9%
Med.

347. Top K Frequent Elements
66.6%
Med.

560. Subarray Sum Equals K
47.4%
Med.

713. Subarray Product Less Than K
54.4%
Med.

1146. Snapshot Array
36.8%
Med.

23. Merge k Sorted Lists
59.7%
Hard

121. Best Time to Buy and Sell Stock
56.9%
Easy

125. Valid Palindrome
53.4%
Easy

252. Meeting Rooms
59.5%
Easy

3. Longest Substring Without Repeating Characters
39.2%
Med.

15. 3Sum
39.2%
Med.

48. Rotate Image
80.2%
Med.

54. Spiral Matrix
56.9%
Med.

72. Edit Distance
60.7%
Med.

112. Path Sum
55.0%
Easy

122. Best Time to Buy and Sell Stock II
71.2%
Med.

127. Word Ladder
45.7%
Hard

151. Reverse Words in a String
56.6%
Med.

309. Best Time to Buy and Sell Stock with Cooldown
62.2%
Med.

412. Fizz Buzz
75.5%
Easy

428. Serialize and Deserialize N-ary Tree
68.8%
Hard

477. Total Hamming Distance
54.9%
Med.

1087. Brace Expansion
66.9%
Med.

4. Median of Two Sorted Arrays
46.7%
Hard

5. Longest Palindromic Substring
37.9%
Med.

36. Valid Sudoku
64.6%
Med.

53. Maximum Subarray
53.4%
Med.

189. Rotate Array
45.0%
Med.

215. Kth Largest Element in an Array
69.0%
Med.

238. Product of Array Except Self
68.9%
Med.

253. Meeting Rooms II
52.7%
Med.

277. Find the Celebrity
49.0%
Med.

295. Find Median from Data Stream
54.5%
Hard

328. Odd Even Linked List
62.6%
Med.

341. Flatten Nested List Iterator
65.7%
Med.

621. Task Scheduler
63.2%
Med.

622. Design Circular Queue
54.8%
Med.

981. Time Based Key-Value Store
50.0%
Med.

2150. Find All Lonely Numbers in the Array
63.2%
Med.

2. Add Two Numbers
48.6%
Med.

10. Regular Expression Matching
31.0%
Hard

11. Container With Most Water
60.1%
Med.

17. Letter Combinations of a Phone Number
66.2%
Med.

18. 4Sum
40.8%
Med.

26. Remove Duplicates from Sorted Array
62.9%
Easy

57. Insert Interval
45.3%
Med.

75. Sort Colors
69.7%
Med.

88. Merge Sorted Array
55.0%
Easy

128. Longest Consecutive Sequence
47.1%
Med.

134. Gas Station
48.1%
Med.

155. Min Stack
58.2%
Med.

208. Implement Trie (Prefix Tree)
69.6%
Med.

217. Contains Duplicate
64.4%
Easy

232. Implement Queue using Stacks
69.9%
Easy

273. Integer to English Words
35.0%
Hard

314. Binary Tree Vertical Order Traversal
57.9%
Med.

329. Longest Increasing Path in a Matrix
56.7%
Hard

432. All O\`one Data Structure
44.3%
Hard

535. Encode and Decode TinyURL
86.6%
Med.

567. Permutation in String
49.0%
Med.

635. Design Log Storage System
59.6%
Med.

736. Parse Lisp Expression
53.6%
Hard

787. Cheapest Flights Within K Stops
41.9%
Med.

841. Keys and Rooms
75.8%
Med.

863. All Nodes Distance K in Binary Tree
67.7%
Med.

889. Construct Binary Tree from Preorder and Postorder Traversal
78.1%
Med.

895. Maximum Frequency Stack
66.8%
Hard

918. Maximum Sum Circular Subarray
50.3%
Med.

931. Minimum Falling Path Sum
60.8%
Med.

1197. Minimum Knight Moves
42.0%
Med.

2435. Paths in Matrix Whose Sum Is Divisible by K
58.8%
Hard

2502. Design Memory Allocator
50.2%
Med.

2633. Convert Object to JSON String
`;

const appleRecentQuestions = parseQuestionFeed(appleRecentQuestionFeed);
const mergedAppleQuestions = mergeQuestionFeeds(
  rawQuestionsByCompany.Apple,
  appleRecentQuestions,
);

const uberRecentQuestionFeed = `
2791. Count Paths That Can Form a Palindrome in a Tree
52.5%
Hard

1429. First Unique Number
57.7%
Med.

2858. Minimum Edge Reversals So Every Node Is Reachable
59.7%
Hard

305. Number of Islands II
40.6%
Hard

1438. Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit
57.7%
Med.

427. Construct Quad Tree
78.4%
Med.

815. Bus Routes
47.3%
Hard

269. Alien Dictionary
37.2%
Hard

977. Squares of a Sorted Array
73.8%
Easy

1101. The Earliest Moment When Everyone Become Friends
66.1%
Med.

1475. Final Prices With a Special Discount in a Shop
84.2%
Easy

79. Word Search
47.5%
Med.

362. Design Hit Counter
69.7%
Med.

1428. Leftmost Column with at Least a One
55.2%
Med.

230. Kth Smallest Element in a BST
76.9%
Med.

162. Find Peak Element
47.0%
Med.

2571. Minimum Operations to Reduce an Integer to 0
62.5%
Med.

410. Split Array Largest Sum
60.6%
Hard

200. Number of Islands
64.5%
Med.

212. Word Search II
38.5%
Hard

399. Evaluate Division
64.3%
Med.

564. Find the Closest Palindrome
32.0%
Hard

827. Making A Large Island
56.7%
Hard

146. LRU Cache
47.4%
Med.

253. Meeting Rooms II
52.7%
Med.

380. Insert Delete GetRandom O(1)
55.4%
Med.

855. Exam Room
43.5%
Med.

864. Shortest Path to Get All Keys
54.7%
Hard

981. Time Based Key-Value Store
50.0%
Med.

2503. Maximum Number of Points From Grid Queries
59.3%
Hard

56. Merge Intervals
52.0%
Med.

204. Count Primes
36.1%
Med.

207. Course Schedule
51.5%
Med.

210. Course Schedule II
55.6%
Med.

384. Shuffle an Array
59.8%
Med.

502. IPO
53.5%
Hard

1966. Binary Searchable Numbers in an Unsorted Array
63.8%
Med.

2861. Maximum Number of Alloys
41.2%
Med.

2954. Count the Number of Infection Sequences
37.8%
Hard

3629. Minimum Jumps to Reach End via Prime Teleportation
44.6%
Med.

5. Longest Palindromic Substring
37.9%
Med.

13. Roman to Integer
66.7%
Easy

33. Search in Rotated Sorted Array
45.0%
Med.

121. Best Time to Buy and Sell Stock
56.9%
Easy

127. Word Ladder
45.7%
Hard

128. Longest Consecutive Sequence
47.1%
Med.

174. Dungeon Game
41.4%
Hard

227. Basic Calculator II
46.9%
Med.

295. Find Median from Data Stream
54.5%
Hard

297. Serialize and Deserialize Binary Tree
60.8%
Hard

545. Boundary of Binary Tree
48.1%
Med.

588. Design In-Memory File System
48.4%
Hard

679. 24 Game
59.5%
Hard

692. Top K Frequent Words
60.2%
Med.

719. Find K-th Smallest Pair Distance
46.6%
Hard

752. Open the Lock
61.3%
Med.

787. Cheapest Flights Within K Stops
41.9%
Med.

802. Find Eventual Safe States
70.9%
Med.

934. Shortest Bridge
59.5%
Med.

987. Vertical Order Traversal of a Binary Tree
53.9%
Hard

994. Rotting Oranges
58.7%
Med.

1197. Minimum Knight Moves
42.0%
Med.

1244. Design A Leaderboard
68.1%
Med.

1915. Number of Wonderful Substrings
66.6%
Med.

1931. Painting a Grid With Three Different Colors
77.1%
Hard

2092. Find All People With Secret
48.4%
Hard

2389. Longest Subsequence With Limited Sum
73.6%
Easy

2402. Meeting Rooms III
51.5%
Hard

2467. Most Profitable Path in a Tree
67.3%
Med.

2477. Minimum Fuel Cost to Report to the Capital
65.4%
Med.

2561. Rearranging Fruits
57.3%
Hard

2948. Make Lexicographically Smallest Array by Swapping Elements
60.3%
Med.

3356. Zero Array Transformation II
43.6%
Med.

3419. Minimize the Maximum Edge Weight of Graph
`;

const uberRecentQuestions = parseQuestionFeed(uberRecentQuestionFeed);
const mergedUberQuestions = mergeQuestionFeeds(
  rawQuestionsByCompany.Uber,
  uberRecentQuestions,
);

const metaRecentQuestionFeed = `
1. Two Sum
57.6%
Easy

2. Add Two Numbers
48.6%
Med.

121. Best Time to Buy and Sell Stock
56.9%
Easy

408. Valid Word Abbreviation
37.0%
Easy

560. Subarray Sum Equals K
47.4%
Med.

1004. Max Consecutive Ones III
67.8%
Med.

4. Median of Two Sorted Arrays
46.7%
Hard

26. Remove Duplicates from Sorted Array
62.9%
Easy

73. Set Matrix Zeroes
63.1%
Med.

20. Valid Parentheses
44.3%
Easy

125. Valid Palindrome
53.4%
Easy

339. Nested List Weight Sum
86.0%
Med.

528. Random Pick with Weight
49.1%
Med.

543. Diameter of Binary Tree
65.6%
Easy

1249. Minimum Remove to Make Valid Parentheses
71.5%
Med.

50. Pow(x, n)
38.7%
Med.

199. Binary Tree Right Side View
70.3%
Med.

236. Lowest Common Ancestor of a Binary Tree
69.4%
Med.

647. Palindromic Substrings
72.9%
Med.

16. 3Sum Closest
48.7%
Med.

56. Merge Intervals
52.0%
Med.

88. Merge Sorted Array
55.0%
Easy

162. Find Peak Element
47.0%
Med.

198. House Robber
53.3%
Med.

314. Binary Tree Vertical Order Traversal
57.9%
Med.

680. Valid Palindrome II
44.3%
Easy

5. Longest Palindromic Substring
37.9%
Med.

9. Palindrome Number
60.6%
Easy

14. Longest Common Prefix
47.7%
Easy

27. Remove Element
61.9%
Easy

31. Next Permutation
45.4%
Med.

39. Combination Sum
76.6%
Med.

53. Maximum Subarray
53.4%
Med.

71. Simplify Path
50.7%
Med.

128. Longest Consecutive Sequence
47.1%
Med.

146. LRU Cache
47.4%
Med.

200. Number of Islands
64.5%
Med.

209. Minimum Size Subarray Sum
51.8%
Med.

1539. Kth Missing Positive Number
63.5%
Easy

11. Container With Most Water
60.1%
Med.

21. Merge Two Sorted Lists
68.4%
Easy

32. Longest Valid Parentheses
38.9%
Hard

33. Search in Rotated Sorted Array
45.0%
Med.

41. First Missing Positive
43.0%
Hard

55. Jump Game
41.0%
Med.

66. Plus One
50.0%
Easy

76. Minimum Window Substring
47.7%
Hard

84. Largest Rectangle in Histogram
50.0%
Hard

129. Sum Root to Leaf Numbers
70.0%
Med.

138. Copy List with Random Pointer
63.0%
Med.

207. Course Schedule
51.5%
Med.

322. Coin Change
48.5%
Med.

678. Valid Parenthesis String
40.2%
Med.

921. Minimum Add to Make Valid Parentheses
74.4%
Med.

938. Range Sum of BST
87.6%
Easy

1650. Lowest Common Ancestor of a Binary Tree III
83.0%
Med.

3761. Minimum Absolute Distance Between Mirror Pairs
59.2%
Med.

3. Longest Substring Without Repeating Characters
39.2%
Med.

13. Roman to Integer
66.7%
Easy

15. 3Sum
39.2%
Med.

18. 4Sum
40.8%
Med.

22. Generate Parentheses
78.7%
Med.

23. Merge k Sorted Lists
59.7%
Hard

34. Find First and Last Position of Element in Sorted Array
49.0%
Med.

42. Trapping Rain Water
67.5%
Hard

48. Rotate Image
80.2%
Med.

62. Unique Paths
66.9%
Med.

65. Valid Number
23.1%
Hard

122. Best Time to Buy and Sell Stock II
71.2%
Med.

131. Palindrome Partitioning
74.1%
Med.

150. Evaluate Reverse Polish Notation
57.9%
Med.

175. Combine Two Tables
79.6%
Easy

189. Rotate Array
45.0%
Med.

231. Power of Two
50.1%
Easy

234. Palindrome Linked List
58.1%
Easy

238. Product of Array Except Self
68.9%
Med.

242. Valid Anagram
68.2%
Easy

283. Move Zeroes
63.9%
Easy

287. Find the Duplicate Number
64.4%
Med.

347. Top K Frequent Elements
66.6%
Med.

349. Intersection of Two Arrays
77.8%
Easy

412. Fizz Buzz
75.5%
Easy

485. Max Consecutive Ones
65.3%
Easy

489. Robot Room Cleaner
78.0%
Hard

498. Diagonal Traverse
67.2%
Med.

636. Exclusive Time of Functions
66.2%
Med.

778. Swim in Rising Water
67.9%
Hard

796. Rotate String
66.7%
Easy

824. Goat Latin
70.0%
Easy

827. Making A Large Island
56.7%
Hard

987. Vertical Order Traversal of a Binary Tree
53.9%
Hard

1581. Customer Who Visited but Did Not Make Any Transactions
67.7%
Easy

1674. Minimum Moves to Make Array Complementary
65.0%
Med.

1871. Jump Game VII
35.6%
Med.

1929. Concatenation of Array
90.3%
Easy

24. Swap Nodes in Pairs
69.6%
Med.

28. Find the Index of the First Occurrence in a String
46.7%
Easy

29. Divide Two Integers
19.8%
Med.

35. Search Insert Position
51.4%
Easy

36. Valid Sudoku
64.6%
Med.

45. Jump Game II
43.0%
Med.

49. Group Anagrams
72.7%
Med.

54. Spiral Matrix
56.9%
Med.

61. Rotate List
42.7%
Med.

70. Climbing Stairs
54.1%
Easy

77. Combinations
74.6%
Med.

80. Remove Duplicates from Sorted Array II
64.8%
Med.

82. Remove Duplicates from Sorted List II
51.9%
Med.

101. Symmetric Tree
61.3%
Easy

104. Maximum Depth of Binary Tree
78.2%
Easy

108. Convert Sorted Array to Binary Search Tree
75.6%
Easy

123. Best Time to Buy and Sell Stock III
53.8%
Hard

124. Binary Tree Maximum Path Sum
42.4%
Hard

127. Word Ladder
45.7%
Hard

130. Surrounded Regions
45.4%
Med.

133. Clone Graph
65.4%
Med.

141. Linked List Cycle
54.4%
Easy

143. Reorder List
65.4%
Med.

153. Find Minimum in Rotated Sorted Array
54.8%
Med.

155. Min Stack
58.2%
Med.

167. Two Sum II - Input Array Is Sorted
65.2%
Med.

169. Majority Element
66.3%
Easy

182. Duplicate Emails
73.8%
Easy

202. Happy Number
59.7%
Easy

212. Word Search II
38.5%
Hard

215. Kth Largest Element in an Array
69.0%
Med.

224. Basic Calculator
46.9%
Hard

227. Basic Calculator II
46.9%
Med.

240. Search a 2D Matrix II
57.4%
Med.

249. Group Shifted Strings
67.8%
Med.

396. Rotate Function
54.2%
Med.

419. Battleships in a Board
77.6%
Med.

424. Longest Repeating Character Replacement
59.8%
Med.

438. Find All Anagrams in a String
53.9%
Med.

525. Contiguous Array
51.5%
Med.

529. Minesweeper
68.8%
Med.

549. Binary Tree Longest Consecutive Sequence II
50.1%
Med.

584. Find Customer Referee
72.9%
Easy

585. Investments in 2016
51.2%
Med.

595. Big Countries
68.5%
Easy

605. Can Place Flowers
29.2%
Easy

645. Set Mismatch
43.5%
Easy

695. Max Area of Island
74.0%
Med.

708. Insert into a Sorted Circular Linked List
38.6%
Med.

724. Find Pivot Index
62.8%
Easy

735. Asteroid Collision
48.0%
Med.

739. Daily Temperatures
68.7%
Med.

863. All Nodes Distance K in Binary Tree
67.7%
Med.

875. Koko Eating Bananas
50.1%
Med.

977. Squares of a Sorted Array
73.8%
Easy

1091. Shortest Path in Binary Matrix
51.6%
Med.

1143. Longest Common Subsequence
59.2%
Med.

1174. Immediate Food Delivery II
56.1%
Med.

1239. Maximum Length of a Concatenated String with Unique Characters
54.8%
Med.

1251. Average Selling Price
37.4%
Easy

1351. Count Negative Numbers in a Sorted Matrix
79.6%
Easy

1752. Check if Array Is Sorted and Rotated
57.4%
Easy

1762. Buildings With an Ocean View
80.9%
Med.

1914. Cyclically Rotating a Grid
74.1%
Med.

1971. Find if Path Exists in Graph
55.2%
Easy

2104. Sum of Subarray Ranges
61.3%
Med.

2574. Left and Right Sum Differences
89.6%
Easy

3300. Minimum Element After Replacement With Digit Sum
89.6%
Easy

3932. Count K-th Roots in a Range
24.4%
Med.
`;

const metaRecentQuestions = parseQuestionFeed(metaRecentQuestionFeed);
const mergedMetaQuestions = mergeQuestionFeeds(
  rawQuestionsByCompany.Meta,
  metaRecentQuestions,
);

const microsoftRecentQuestionFeed = `
1. Two Sum
57.6%
Easy

3. Longest Substring Without Repeating Characters
39.2%
Med.

2. Add Two Numbers
48.6%
Med.

5. Longest Palindromic Substring
37.9%
Med.

42. Trapping Rain Water
67.5%
Hard

15. 3Sum
39.2%
Med.

146. LRU Cache
47.4%
Med.

200. Number of Islands
64.5%
Med.

14. Longest Common Prefix
47.7%
Easy

22. Generate Parentheses
78.7%
Med.

33. Search in Rotated Sorted Array
45.0%
Med.

53. Maximum Subarray
53.4%
Med.

560. Subarray Sum Equals K
47.4%
Med.

1475. Final Prices With a Special Discount in a Shop
84.2%
Easy

7. Reverse Integer
32.0%
Med.

11. Container With Most Water
60.1%
Med.

23. Merge k Sorted Lists
59.7%
Hard

56. Merge Intervals
52.0%
Med.

76. Minimum Window Substring
47.7%
Hard

128. Longest Consecutive Sequence
47.1%
Med.

70. Climbing Stairs
54.1%
Easy

121. Best Time to Buy and Sell Stock
56.9%
Easy

202. Happy Number
59.7%
Easy

295. Find Median from Data Stream
54.5%
Hard

297. Serialize and Deserialize Binary Tree
60.8%
Hard

424. Longest Repeating Character Replacement
59.8%
Med.

509. Fibonacci Number
74.2%
Easy

9. Palindrome Number
60.6%
Easy

31. Next Permutation
45.4%
Med.

138. Copy List with Random Pointer
63.0%
Med.

143. Reorder List
65.4%
Med.

232. Implement Queue using Stacks
69.9%
Easy

300. Longest Increasing Subsequence
59.5%
Med.

875. Koko Eating Bananas
50.1%
Med.

2858. Minimum Edge Reversals So Every Node Is Reachable
59.7%
Hard

6. Zigzag Conversion
54.2%
Med.

13. Roman to Integer
66.7%
Easy

18. 4Sum
40.8%
Med.

20. Valid Parentheses
44.3%
Easy

21. Merge Two Sorted Lists
68.4%
Easy

45. Jump Game II
43.0%
Med.

46. Permutations
82.0%
Med.

49. Group Anagrams
72.7%
Med.

50. Pow(x, n)
38.7%
Med.

51. N-Queens
75.7%
Hard

55. Jump Game
41.0%
Med.

61. Rotate List
42.7%
Med.

75. Sort Colors
69.7%
Med.

84. Largest Rectangle in Histogram
50.0%
Hard

88. Merge Sorted Array
55.0%
Easy

105. Construct Binary Tree from Preorder and Inorder Traversal
68.9%
Med.

125. Valid Palindrome
53.4%
Easy

155. Min Stack
58.2%
Med.

198. House Robber
53.3%
Med.

206. Reverse Linked List
80.6%
Easy

217. Contains Duplicate
64.4%
Easy

238. Product of Array Except Self
68.9%
Med.

239. Sliding Window Maximum
48.8%
Hard

273. Integer to English Words
35.0%
Hard

460. LFU Cache
49.4%
Hard

475. Heaters
42.0%
Med.

540. Single Element in a Sorted Array
59.3%
Med.

657. Robot Return to Origin
78.1%
Easy

721. Accounts Merge
61.4%
Med.

829. Consecutive Numbers Sum
42.7%
Hard

992. Subarrays with K Different Integers
68.2%
Hard

1004. Max Consecutive Ones III
67.8%
Med.

1353. Maximum Number of Events That Can Be Attended
39.0%
Med.

2667. Create Hello World Function
81.9%
Easy

12. Integer to Roman
71.1%
Med.

16. 3Sum Closest
48.7%
Med.

17. Letter Combinations of a Phone Number
66.2%
Med.

26. Remove Duplicates from Sorted Array
62.9%
Easy

27. Remove Element
61.9%
Easy

28. Find the Index of the First Occurrence in a String
46.7%
Easy

32. Longest Valid Parentheses
38.9%
Hard

36. Valid Sudoku
64.6%
Med.

48. Rotate Image
80.2%
Med.

62. Unique Paths
66.9%
Med.

66. Plus One
50.0%
Easy

69. Sqrt(x)
41.9%
Easy

78. Subsets
82.4%
Med.

79. Word Search
47.5%
Med.

90. Subsets II
61.4%
Med.

98. Validate Binary Search Tree
35.8%
Med.

100. Same Tree
67.2%
Easy

102. Binary Tree Level Order Traversal
72.8%
Med.

104. Maximum Depth of Binary Tree
78.2%
Easy

122. Best Time to Buy and Sell Stock II
71.2%
Med.

124. Binary Tree Maximum Path Sum
42.4%
Hard

131. Palindrome Partitioning
74.1%
Med.

132. Palindrome Partitioning II
37.2%
Hard

139. Word Break
49.5%
Med.

175. Combine Two Tables
79.6%
Easy

176. Second Highest Salary
47.2%
Med.

181. Employees Earning More Than Their Managers
73.3%
Easy

189. Rotate Array
45.0%
Med.

193. Valid Phone Numbers
29.8%
Easy

196. Delete Duplicate Emails
66.1%
Easy

199. Binary Tree Right Side View
70.3%
Med.

204. Count Primes
36.1%
Med.

216. Combination Sum III
73.3%
Med.

224. Basic Calculator
46.9%
Hard

234. Palindrome Linked List
58.1%
Easy

253. Meeting Rooms II
52.7%
Med.

283. Move Zeroes
63.9%
Easy

287. Find the Duplicate Number
64.4%
Med.

347. Top K Frequent Elements
66.6%
Med.

383. Ransom Note
66.0%
Easy

387. First Unique Character in a String
65.6%
Easy

392. Is Subsequence
49.1%
Easy

404. Sum of Left Leaves
62.8%
Easy

407. Trapping Rain Water II
64.1%
Hard

410. Split Array Largest Sum
60.6%
Hard

428. Serialize and Deserialize N-ary Tree
68.8%
Hard

443. String Compression
60.1%
Med.

493. Reverse Pairs
34.4%
Hard

496. Next Greater Element I
76.2%
Easy

503. Next Greater Element II
68.5%
Med.

525. Contiguous Array
51.5%
Med.

526. Beautiful Arrangement
64.8%
Med.

542. 01 Matrix
54.0%
Med.

543. Diameter of Binary Tree
65.6%
Easy

570. Managers with at Least 5 Direct Reports
49.1%
Med.

584. Find Customer Referee
72.9%
Easy

586. Customer Placing the Largest Number of Orders
64.5%
Easy

621. Task Scheduler
63.2%
Med.

622. Design Circular Queue
54.8%
Med.

643. Maximum Average Subarray I
47.9%
Easy

647. Palindromic Substrings
72.9%
Med.

658. Find K Closest Elements
49.7%
Med.

678. Valid Parenthesis String
40.2%
Med.

680. Valid Palindrome II
44.3%
Easy

785. Is Graph Bipartite?
59.4%
Med.

796. Rotate String
66.7%
Easy

827. Making A Large Island
56.7%
Hard

863. All Nodes Distance K in Binary Tree
67.7%
Med.

907. Sum of Subarray Minimums
38.6%
Med.

987. Vertical Order Traversal of a Binary Tree
53.9%
Hard

994. Rotting Oranges
58.7%
Med.

1280. Students and Examinations
61.3%
Easy

1431. Kids With the Greatest Number of Candies
88.0%
Easy

1547. Minimum Cost to Cut a Stick
63.1%
Hard

1552. Magnetic Force Between Two Balls
72.2%
Med.

1674. Minimum Moves to Make Array Complementary
65.0%
Med.

1727. Largest Submatrix With Rearrangements
80.2%
Med.

1757. Recyclable and Low Fat Products
88.6%
Easy

1838. Frequency of the Most Frequent Element
44.9%
Med.

1932. Merge BSTs to Create Single BST
39.0%
Hard

1979. Find Greatest Common Divisor of Array
80.0%
Easy

2161. Partition Array According to Given Pivot
90.8%
Med.

2385. Amount of Time for Binary Tree to Be Infected
65.5%
Med.

2553. Separate the Digits in an Array
85.8%
Easy

2571. Minimum Operations to Reduce an Integer to 0
62.5%
Med.

2784. Check if Array is Good
57.2%
Easy

2906. Construct Product Matrix
51.7%
Med.

3418. Maximum Amount of Money Robot Can Earn
47.8%
Med.

3546. Equal Sum Grid Partition I
52.9%
Med.

3741. Minimum Distance Between Three Equal Elements II
74.8%
Med.

3742. Maximum Path Score in a Grid
53.8%
Med.

3946. Maximum Number of Items From Sale I
37.1%
Med.
`;

const microsoftRecentQuestions = parseQuestionFeed(microsoftRecentQuestionFeed);
const mergedMicrosoftQuestions = mergeQuestionFeeds(
  rawQuestionsByCompany.Microsoft,
  microsoftRecentQuestions,
);

const adobeRecentQuestionFeed = `
761. Special Binary String
79.4%
Hard

49. Group Anagrams
72.7%
Med.

1. Two Sum
57.6%
Easy

76. Minimum Window Substring
47.7%
Hard

14. Longest Common Prefix
47.7%
Easy

56. Merge Intervals
52.0%
Med.

200. Number of Islands
64.5%
Med.

12. Integer to Roman
71.1%
Med.

31. Next Permutation
45.4%
Med.

2. Add Two Numbers
48.6%
Med.

3. Longest Substring Without Repeating Characters
39.2%
Med.

55. Jump Game
41.0%
Med.

121. Best Time to Buy and Sell Stock
56.9%
Easy

146. LRU Cache
47.4%
Med.

152. Maximum Product Subarray
36.5%
Med.

169. Majority Element
66.3%
Easy

468. Validate IP Address
28.3%
Med.

1636. Sort Array by Increasing Frequency
80.8%
Easy

4. Median of Two Sorted Arrays
46.7%
Hard

5. Longest Palindromic Substring
37.9%
Med.

8. String to Integer (atoi)
21.1%
Med.

20. Valid Parentheses
44.3%
Easy

42. Trapping Rain Water
67.5%
Hard

54. Spiral Matrix
56.9%
Med.

322. Coin Change
48.5%
Med.

692. Top K Frequent Words
60.2%
Med.

2895. Minimum Processing Time
70.4%
Med.

13. Roman to Integer
66.7%
Easy

15. 3Sum
39.2%
Med.

74. Search a 2D Matrix
54.0%
Med.

93. Restore IP Addresses
56.1%
Med.

206. Reverse Linked List
80.6%
Easy

236. Lowest Common Ancestor of a Binary Tree
69.4%
Med.

547. Number of Provinces
70.5%
Med.

904. Fruit Into Baskets
51.3%
Med.

910. Smallest Range II
37.9%
Med.

994. Rotting Oranges
58.7%
Med.

2506. Count Pairs Of Similar Strings
73.7%
Easy

7. Reverse Integer
32.0%
Med.

33. Search in Rotated Sorted Array
45.0%
Med.

45. Jump Game II
43.0%
Med.

48. Rotate Image
80.2%
Med.

51. N-Queens
75.7%
Hard

70. Climbing Stairs
54.1%
Easy

103. Binary Tree Zigzag Level Order Traversal
63.8%
Med.

105. Construct Binary Tree from Preorder and Inorder Traversal
68.9%
Med.

134. Gas Station
48.1%
Med.

179. Largest Number
43.1%
Med.

198. House Robber
53.3%
Med.

238. Product of Array Except Self
68.9%
Med.

239. Sliding Window Maximum
48.8%
Hard

253. Meeting Rooms II
52.7%
Med.

283. Move Zeroes
63.9%
Easy

292. Nim Game
59.9%
Easy

329. Longest Increasing Path in a Matrix
56.7%
Hard

347. Top K Frequent Elements
66.6%
Med.

402. Remove K Digits
37.0%
Med.

528. Random Pick with Weight
49.1%
Med.

638. Shopping Offers
52.5%
Med.

875. Koko Eating Bananas
50.1%
Med.

1293. Shortest Path in a Grid with Obstacles Elimination
46.4%
Hard

1863. Sum of All Subset XOR Totals
90.1%
Easy

2328. Number of Increasing Paths in a Grid
57.4%
Hard

2406. Divide Intervals Into Minimum Number of Groups
63.6%
Med.

3528. Unit Conversion I
54.1%
Med.

11. Container With Most Water
60.1%
Med.

22. Generate Parentheses
78.7%
Med.

25. Reverse Nodes in k-Group
66.2%
Hard

27. Remove Element
61.9%
Easy

40. Combination Sum II
59.5%
Med.

50. Pow(x, n)
38.7%
Med.

67. Add Binary
58.1%
Easy

75. Sort Colors
69.7%
Med.

84. Largest Rectangle in Histogram
50.0%
Hard

91. Decode Ways
38.1%
Med.

102. Binary Tree Level Order Traversal
72.8%
Med.

125. Valid Palindrome
53.4%
Easy

127. Word Ladder
45.7%
Hard

128. Longest Consecutive Sequence
47.1%
Med.

130. Surrounded Regions
45.4%
Med.

136. Single Number
77.8%
Easy

155. Min Stack
58.2%
Med.

167. Two Sum II - Input Array Is Sorted
65.2%
Med.

173. Binary Search Tree Iterator
76.5%
Med.

195. Tenth Line
36.9%
Easy

207. Course Schedule
51.5%
Med.

219. Contains Duplicate II
51.4%
Easy

222. Count Complete Tree Nodes
72.7%
Easy

237. Delete Node in a Linked List
83.9%
Med.

258. Add Digits
69.0%
Easy

268. Missing Number
72.1%
Easy

307. Range Sum Query - Mutable
43.2%
Med.

339. Nested List Weight Sum
86.0%
Med.

355. Design Twitter
44.8%
Med.

417. Pacific Atlantic Water Flow
61.0%
Med.

424. Longest Repeating Character Replacement
59.8%
Med.

525. Contiguous Array
51.5%
Med.

540. Single Element in a Sorted Array
59.3%
Med.

542. 01 Matrix
54.0%
Med.

545. Boundary of Binary Tree
48.1%
Med.

556. Next Greater Element III
35.4%
Med.

560. Subarray Sum Equals K
47.4%
Med.

567. Permutation in String
49.0%
Med.

669. Trim a Binary Search Tree
66.7%
Med.

703. Kth Largest Element in a Stream
61.1%
Easy

793. Preimage Size of Factorial Zeroes Function
47.1%
Hard

795. Number of Subarrays with Bounded Maximum
55.0%
Med.

864. Shortest Path to Get All Keys
54.7%
Hard

908. Smallest Range I
73.6%
Easy

977. Squares of a Sorted Array
73.8%
Easy

993. Cousins in Binary Tree
59.4%
Easy

1004. Max Consecutive Ones III
67.8%
Med.

1190. Reverse Substrings Between Each Pair of Parentheses
72.0%
Med.

1268. Search Suggestions System
65.2%
Med.

1507. Reformat Date
68.6%
Easy

1581. Customer Who Visited but Did Not Make Any Transactions
67.7%
Easy

1916. Count Ways to Build Rooms in an Ant Colony
51.5%
Hard

1963. Minimum Number of Swaps to Make the String Balanced
78.0%
Med.

2055. Plates Between Candles
47.5%
Med.

2134. Minimum Swaps to Group All 1's Together II
65.7%
Med.

2143. Choose Numbers From Two Arrays in Range
52.8%
Hard

2275. Largest Combination With Bitwise AND Greater Than Zero
80.8%
Med.

2291. Maximum Profit From Trading Stocks
48.3%
Med.

2385. Amount of Time for Binary Tree to Be Infected
65.5%
Med.

2422. Merge Operations to Turn Array Into a Palindrome
68.9%
Med.

2429. Minimize XOR
62.4%
Med.

2536. Increment Submatrices by One
73.8%
Med.

2704. To Be Or Not To Be
63.4%
Easy

2892. Minimizing Array After Replacing Pairs With Their Product
40.8%
Med.

2962. Count Subarrays Where Max Element Appears at Least K Times
62.4%
Med.

3046. Split the Array
61.4%
Easy

3173. Bitwise OR of Adjacent Elements
94.8%
Easy
`;

const adobeRecentQuestions = parseQuestionFeed(adobeRecentQuestionFeed);
const mergedAdobeQuestions = mergeQuestionFeeds(
  rawQuestionsByCompany.Adobe,
  adobeRecentQuestions,
);

const walmartRecentQuestionFeed = `
3. Longest Substring Without Repeating Characters
39.2%
Med.

146. LRU Cache
47.4%
Med.

20. Valid Parentheses
44.3%
Easy

1. Two Sum
57.6%
Easy

33. Search in Rotated Sorted Array
45.0%
Med.

200. Number of Islands
64.5%
Med.

22. Generate Parentheses
78.7%
Med.

42. Trapping Rain Water
67.5%
Hard

56. Merge Intervals
52.0%
Med.

139. Word Break
49.5%
Med.

39. Combination Sum
76.6%
Med.

49. Group Anagrams
72.7%
Med.

322. Coin Change
48.5%
Med.

300. Longest Increasing Subsequence
59.5%
Med.

716. Max Stack
45.9%
Hard

4. Median of Two Sorted Arrays
46.7%
Hard

5. Longest Palindromic Substring
37.9%
Med.

11. Container With Most Water
60.1%
Med.

54. Spiral Matrix
56.9%
Med.

103. Binary Tree Zigzag Level Order Traversal
63.8%
Med.

121. Best Time to Buy and Sell Stock
56.9%
Easy

128. Longest Consecutive Sequence
47.1%
Med.

12. Integer to Roman
71.1%
Med.

23. Merge k Sorted Lists
59.7%
Hard

25. Reverse Nodes in k-Group
66.2%
Hard

36. Valid Sudoku
64.6%
Med.

44. Wildcard Matching
32.1%
Hard

67. Add Binary
58.1%
Easy

75. Sort Colors
69.7%
Med.

90. Subsets II
61.4%
Med.

199. Binary Tree Right Side View
70.3%
Med.

215. Kth Largest Element in an Array
69.0%
Med.

295. Find Median from Data Stream
54.5%
Hard

362. Design Hit Counter
69.7%
Med.

387. First Unique Character in a String
65.6%
Easy

407. Trapping Rain Water II
64.1%
Hard

498. Diagonal Traverse
67.2%
Med.

647. Palindromic Substrings
72.9%
Med.

994. Rotting Oranges
58.7%
Med.

1329. Sort the Matrix Diagonally
83.2%
Med.

6. Zigzag Conversion
54.2%
Med.

15. 3Sum
39.2%
Med.

31. Next Permutation
45.4%
Med.

41. First Missing Positive
43.0%
Hard

53. Maximum Subarray
53.4%
Med.

55. Jump Game
41.0%
Med.

57. Insert Interval
45.3%
Med.

73. Set Matrix Zeroes
63.1%
Med.

74. Search a 2D Matrix
54.0%
Med.

76. Minimum Window Substring
47.7%
Hard

79. Word Search
47.5%
Med.

91. Decode Ways
38.1%
Med.

106. Construct Binary Tree from Inorder and Postorder Traversal
68.8%
Med.

138. Copy List with Random Pointer
63.0%
Med.

153. Find Minimum in Rotated Sorted Array
54.8%
Med.

198. House Robber
53.3%
Med.

210. Course Schedule II
55.6%
Med.

283. Move Zeroes
63.9%
Easy

347. Top K Frequent Elements
66.6%
Med.

402. Remove K Digits
37.0%
Med.

460. LFU Cache
49.4%
Hard

490. The Maze
60.4%
Med.

556. Next Greater Element III
35.4%
Med.

1209. Remove All Adjacent Duplicates in String II
61.4%
Med.

1249. Minimum Remove to Make Valid Parentheses
71.5%
Med.

2406. Divide Intervals Into Minimum Number of Groups
63.6%
Med.

2461. Maximum Sum of Distinct Subarrays With Length K
43.1%
Med.

7. Reverse Integer
32.0%
Med.

13. Roman to Integer
66.7%
Easy

14. Longest Common Prefix
47.7%
Easy

19. Remove Nth Node From End of List
51.7%
Med.

48. Rotate Image
80.2%
Med.

50. Pow(x, n)
38.7%
Med.

52. N-Queens II
78.8%
Hard

72. Edit Distance
60.7%
Med.

78. Subsets
82.4%
Med.

81. Search in Rotated Sorted Array II
40.1%
Med.

84. Largest Rectangle in Histogram
50.0%
Hard

92. Reverse Linked List II
51.6%
Med.

115. Distinct Subsequences
52.0%
Hard

116. Populating Next Right Pointers in Each Node
67.3%
Med.

120. Triangle
59.9%
Med.

122. Best Time to Buy and Sell Stock II
71.2%
Med.

125. Valid Palindrome
53.4%
Easy

141. Linked List Cycle
54.4%
Easy

152. Maximum Product Subarray
36.5%
Med.

155. Min Stack
58.2%
Med.

162. Find Peak Element
47.0%
Med.

189. Rotate Array
45.0%
Med.

197. Rising Temperature
51.4%
Easy

207. Course Schedule
51.5%
Med.

227. Basic Calculator II
46.9%
Med.

238. Product of Array Except Self
68.9%
Med.

253. Meeting Rooms II
52.7%
Med.

305. Number of Islands II
40.6%
Hard

332. Reconstruct Itinerary
44.6%
Hard

341. Flatten Nested List Iterator
65.7%
Med.

373. Find K Pairs with Smallest Sums
42.0%
Med.

395. Longest Substring with At Least K Repeating Characters
46.3%
Med.

416. Partition Equal Subset Sum
49.5%
Med.

438. Find All Anagrams in a String
53.9%
Med.

442. Find All Duplicates in an Array
77.0%
Med.

451. Sort Characters By Frequency
75.4%
Med.

525. Contiguous Array
51.5%
Med.

543. Diameter of Binary Tree
65.6%
Easy

567. Permutation in String
49.0%
Med.

665. Non-decreasing Array
25.5%
Med.

694. Number of Distinct Islands
62.8%
Med.

730. Count Different Palindromic Subsequences
47.9%
Hard

735. Asteroid Collision
48.0%
Med.

739. Daily Temperatures
68.7%
Med.

876. Middle of the Linked List
81.9%
Easy

1122. Relative Sort Array
75.3%
Easy

1143. Longest Common Subsequence
59.2%
Med.

1238. Circular Permutation in Binary Representation
72.8%
Med.

1486. XOR Operation in an Array
87.6%
Easy

1823. Find the Winner of the Circular Game
82.3%
Med.

1977. Number of Ways to Separate Numbers
21.7%
Hard

2071. Maximum Number of Tasks You Can Assign
50.0%
Hard

2072. The Winner University
75.6%
Easy

2179. Count Good Triplets in an Array
65.4%
Hard

2402. Meeting Rooms III
51.5%
Hard

2423. Remove Letter To Equalize Frequency
19.4%
Easy

2449. Minimum Number of Operations to Make Arrays Similar
61.4%
Hard

2541. Minimum Operations to Make Array Equal II
33.2%
Med.

3005. Count Elements With Maximum Frequency
79.8%
Easy

3090. Maximum Length Substring With Two Occurrences
65.6%
Easy

3179. Find the N-th Value After K Seconds
54.0%
Med.
`;

const walmartRecentQuestions = parseQuestionFeed(walmartRecentQuestionFeed);
const mergedWalmartQuestions = mergeQuestionFeeds(
  rawQuestionsByCompany.Walmart,
  walmartRecentQuestions,
);

const netflixRecentQuestionFeed = `
2622. Cache With Time Limit
76.2%
Med.

3. Longest Substring Without Repeating Characters
39.2%
Med.

981. Time Based Key-Value Store
50.0%
Med.

56. Merge Intervals
52.0%
Med.

210. Course Schedule II
55.6%
Med.

220. Contains Duplicate III
24.8%
Hard

253. Meeting Rooms II
52.7%
Med.

332. Reconstruct Itinerary
44.6%
Hard

359. Logger Rate Limiter
76.8%
Easy

1136. Parallel Courses
62.3%
Med.

219. Contains Duplicate II
51.4%
Easy

8. String to Integer (atoi)
21.1%
Med.

79. Word Search
47.5%
Med.

217. Contains Duplicate
64.4%
Easy

743. Network Delay Time
60.6%
Med.

41. First Missing Positive
43.0%
Hard

146. LRU Cache
47.4%
Med.

228. Summary Ranges
54.3%
Easy

139. Word Break
49.5%
Med.

347. Top K Frequent Elements
66.6%
Med.

875. Koko Eating Bananas
50.1%
Med.

162. Find Peak Element
47.0%
Med.

242. Valid Anagram
68.2%
Easy

460. LFU Cache
49.4%
Hard

642. Design Search Autocomplete System
50.0%
Hard

718. Maximum Length of Repeated Subarray
51.4%
Med.

797. All Paths From Source to Target
83.6%
Med.

904. Fruit Into Baskets
51.3%
Med.

1146. Snapshot Array
36.8%
Med.
`;

const netflixRecentQuestions = parseQuestionFeed(netflixRecentQuestionFeed);
const mergedNetflixQuestions = mergeQuestionFeeds(
  rawQuestionsByCompany.Netflix,
  netflixRecentQuestions,
);

const atlassianRecentQuestionFeed = `
1366. Rank Teams by Votes
60.1%
Med.

2034. Stock Price Fluctuation
49.1%
Med.

432. All O\`one Data Structure
44.3%
Hard

353. Design Snake Game
40.0%
Med.

56. Merge Intervals
52.0%
Med.

236. Lowest Common Ancestor of a Binary Tree
69.4%
Med.

253. Meeting Rooms II
52.7%
Med.

2639. Find the Width of Columns of a Grid
70.5%
Easy

2933. High-Access Employees
47.5%
Med.

68. Text Justification
51.3%
Hard

2975. Maximum Square Area by Removing Fences From a Field
49.5%
Med.

3000. Maximum Area of Longest Diagonal Rectangle
45.9%
Easy

79. Word Search
47.5%
Med.

1676. Lowest Common Ancestor of a Binary Tree IV
79.6%
Med.

2039. The Time When the Network Becomes Idle
55.7%
Med.

347. Top K Frequent Elements
66.6%
Med.

49. Group Anagrams
72.7%
Med.

359. Logger Rate Limiter
76.8%
Easy

605. Can Place Flowers
29.2%
Easy

121. Best Time to Buy and Sell Stock
56.9%
Easy

354. Russian Doll Envelopes
37.9%
Hard

875. Koko Eating Bananas
50.1%
Med.

1. Two Sum
57.6%
Easy

45. Jump Game II
43.0%
Med.

128. Longest Consecutive Sequence
47.1%
Med.

177. Nth Highest Salary
39.3%
Med.

1010. Pairs of Songs With Total Durations Divisible by 60
53.5%
Med.

1048. Longest String Chain
63.1%
Med.

1970. Last Day Where You Can Still Cross
68.7%
Hard

2561. Rearranging Fruits
57.3%
Hard

2959. Number of Possible Sets of Closing Branches
51.2%
Hard

3. Longest Substring Without Repeating Characters
39.2%
Med.

31. Next Permutation
45.4%
Med.

34. Find First and Last Position of Element in Sorted Array
49.0%
Med.

44. Wildcard Matching
32.1%
Hard

53. Maximum Subarray
53.4%
Med.

146. LRU Cache
47.4%
Med.

211. Design Add and Search Words Data Structure
48.6%
Med.

297. Serialize and Deserialize Binary Tree
60.8%
Hard

300. Longest Increasing Subsequence
59.5%
Med.

362. Design Hit Counter
69.7%
Med.

658. Find K Closest Elements
49.7%
Med.

881. Boats to Save People
61.9%
Med.

1166. Design File System
65.1%
Med.

1307. Verbal Arithmetic Puzzle
34.8%
Hard

1644. Lowest Common Ancestor of a Binary Tree II
69.7%
Med.

1650. Lowest Common Ancestor of a Binary Tree III
83.0%
Med.

1797. Design Authentication Manager
58.6%
Med.

2353. Design a Food Rating System
52.9%
Med.

2484. Count Palindromic Subsequences
41.2%
Hard

2559. Count Vowel Strings in Ranges
67.8%
Med.

2577. Minimum Time to Visit a Cell In a Grid
56.2%
Hard

2598. Smallest Missing Non-negative Integer After Operations
55.9%
Med.

2948. Make Lexicographically Smallest Array by Swapping Elements
60.3%
Med.

2976. Minimum Cost to Convert String I
63.1%
Med.

2977. Minimum Cost to Convert String II
59.5%
Hard

3026. Maximum Good Subarray Sum
`;

const atlassianRecentQuestions = parseQuestionFeed(atlassianRecentQuestionFeed);
const mergedAtlassianQuestions = mergeQuestionFeeds(
  rawQuestionsByCompany.Atlassian,
  atlassianRecentQuestions,
);

const flipkartRecentQuestionFeed = `
11. Container With Most Water
60.1%
Med.

1423. Maximum Points You Can Obtain from Cards
57.8%
Med.

3576. Transform Array to All Equal Elements
33.3%
Med.

134. Gas Station
48.1%
Med.

875. Koko Eating Bananas
50.1%
Med.

994. Rotting Oranges
58.7%
Med.

42. Trapping Rain Water
67.5%
Hard

84. Largest Rectangle in Histogram
50.0%
Hard

1. Two Sum
57.6%
Easy

33. Search in Rotated Sorted Array
45.0%
Med.

31. Next Permutation
45.4%
Med.

174. Dungeon Game
41.4%
Hard

675. Cut Off Trees for Golf Event
36.5%
Hard

735. Asteroid Collision
48.0%
Med.

749. Contain Virus
55.0%
Hard

850. Rectangle Area II
56.2%
Hard

907. Sum of Subarray Minimums
38.6%
Med.

1190. Reverse Substrings Between Each Pair of Parentheses
72.0%
Med.

1383. Maximum Performance of a Team
47.8%
Hard

1463. Cherry Pickup II
72.4%
Hard

3. Longest Substring Without Repeating Characters
39.2%
Med.

22. Generate Parentheses
78.7%
Med.

48. Rotate Image
80.2%
Med.

56. Merge Intervals
52.0%
Med.

62. Unique Paths
66.9%
Med.

72. Edit Distance
60.7%
Med.

127. Word Ladder
45.7%
Hard

135. Candy
48.5%
Hard

215. Kth Largest Element in an Array
69.0%
Med.

221. Maximal Square
50.4%
Med.

295. Find Median from Data Stream
54.5%
Hard

321. Create Maximum Number
35.6%
Hard

399. Evaluate Division
64.3%
Med.

407. Trapping Rain Water II
64.1%
Hard

496. Next Greater Element I
76.2%
Easy

560. Subarray Sum Equals K
47.4%
Med.

662. Maximum Width of Binary Tree
45.7%
Med.

787. Cheapest Flights Within K Stops
41.9%
Med.

939. Minimum Area Rectangle
55.5%
Med.

1011. Capacity To Ship Packages Within D Days
74.0%
Med.

1192. Critical Connections in a Network
59.8%
Hard

1912. Design Movie Rental System
62.2%
Hard

2952. Minimum Number of Coins to be Added
58.2%
Med.

4. Median of Two Sorted Arrays
46.7%
Hard

15. 3Sum
39.2%
Med.

16. 3Sum Closest
48.7%
Med.

20. Valid Parentheses
44.3%
Easy

23. Merge k Sorted Lists
59.7%
Hard

32. Longest Valid Parentheses
38.9%
Hard

41. First Missing Positive
43.0%
Hard

75. Sort Colors
69.7%
Med.

85. Maximal Rectangle
58.9%
Hard

91. Decode Ways
38.1%
Med.

113. Path Sum II
62.3%
Med.

146. LRU Cache
47.4%
Med.

153. Find Minimum in Rotated Sorted Array
54.8%
Med.

155. Min Stack
58.2%
Med.

198. House Robber
53.3%
Med.

200. Number of Islands
64.5%
Med.

210. Course Schedule II
55.6%
Med.

222. Count Complete Tree Nodes
72.7%
Easy

238. Product of Array Except Self
68.9%
Med.

287. Find the Duplicate Number
64.4%
Med.

297. Serialize and Deserialize Binary Tree
60.8%
Hard

332. Reconstruct Itinerary
44.6%
Hard

366. Find Leaves of Binary Tree
81.3%
Med.

373. Find K Pairs with Smallest Sums
42.0%
Med.

416. Partition Equal Subset Sum
49.5%
Med.

424. Longest Repeating Character Replacement
59.8%
Med.

450. Delete Node in a BST
54.8%
Med.

451. Sort Characters By Frequency
75.4%
Med.

540. Single Element in a Sorted Array
59.3%
Med.

542. 01 Matrix
54.0%
Med.

632. Smallest Range Covering Elements from K Lists
70.2%
Hard

658. Find K Closest Elements
49.7%
Med.

669. Trim a Binary Search Tree
66.7%
Med.

677. Map Sum Pairs
57.2%
Med.

726. Number of Atoms
65.1%
Hard

741. Cherry Pickup
39.6%
Hard

863. All Nodes Distance K in Binary Tree
67.7%
Med.

881. Boats to Save People
61.9%
Med.

895. Maximum Frequency Stack
66.8%
Hard

911. Online Election
52.9%
Med.

934. Shortest Bridge
59.5%
Med.

967. Numbers With Same Consecutive Differences
59.2%
Med.

982. Triples with Bitwise AND Equal To Zero
60.0%
Hard

1094. Car Pooling
56.4%
Med.

1105. Filling Bookcase Shelves
68.6%
Med.

1482. Minimum Number of Days to Make m Bouquets
56.6%
Med.

1552. Magnetic Force Between Two Balls
72.2%
Med.

1584. Min Cost to Connect All Points
71.0%
Med.

1760. Minimum Limit of Balls in a Bag
66.2%
Med.

2019. The Score of Students Solving Math Expression
34.4%
Hard

2093. Minimum Cost to Reach City With Discounts
61.0%
Med.

2385. Amount of Time for Binary Tree to Be Infected
65.5%
Med.

2750. Ways to Split Array Into Good Subarrays
35.1%
Med.

2751. Robot Collisions
61.6%
Hard
`;

const flipkartRecentQuestions = parseQuestionFeed(flipkartRecentQuestionFeed);
const mergedFlipkartQuestions = mergeQuestionFeeds(
  rawQuestionsByCompany.Flipkart,
  flipkartRecentQuestions,
);

export const dsaCompanies: DsaCompany[] = Object.entries(
  rawQuestionsByCompany,
).map(([name, questions]) => ({
  id: toCompanyId(name),
  name,
  logo: companyMeta[name].logo,
  accent: companyMeta[name].accent,
  questions: buildQuestions(
    name,
    name === "Google"
      ? mergedGoogleQuestions
      : name === "Amazon"
        ? mergedAmazonQuestions
        : name === "Apple"
          ? mergedAppleQuestions
          : name === "Uber"
            ? mergedUberQuestions
            : name === "Meta"
              ? mergedMetaQuestions
              : name === "Microsoft"
                ? mergedMicrosoftQuestions
              : name === "Walmart"
                  ? mergedWalmartQuestions
                : name === "Netflix"
                    ? mergedNetflixQuestions
                    : name === "Atlassian"
                      ? mergedAtlassianQuestions
                      : name === "Flipkart"
                        ? mergedFlipkartQuestions
                : name === "Adobe"
                  ? mergedAdobeQuestions
                  : questions,
  ),
}));
