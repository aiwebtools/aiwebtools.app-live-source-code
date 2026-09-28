import { useState, useEffect, useCallback, useRef, memo, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { Play, Pause, X, SkipForward, SkipBack, Volume2, VolumeX } from "lucide-react";
import type { Tool } from "@/types/tools";
import { useScrollThreshold } from "@/hooks/useScrollThreshold";
import mtvAiWebToolsLogo from "@/assets/mtv-aiwebtools-logo.png";

const YT_EMBED_ORIGIN = "https://www.youtube-nocookie.com";
const YT_API_ORIGIN_FALLBACK = "https://www.youtube.com";

const SESSION_CLOSED_KEY = "pinned-video-closed";
const SHUFFLED_TOOLS_KEY = "pinned-video-shuffled-tools";
const CURRENT_INDEX_KEY = "pinned-video-current-index";
const MODE_SESSION_KEY = "pinned-video-mode"; // 'idle' | 'tools' | 'music'

// Curated AIWebTools.ai 9:16 vertical original music-video gallery.
// These play in the music-video mode of the pinned player. All link to the
// Music Video Maker AI Studio tool.
//
// ORDERING RULE: Real cinematic music videos (with actual visuals) play FIRST.
// Suno-style lyric/audio tracks (just lyrics on screen) play LAST, so the reel
// always leads with the most eye-catching content.
export const MUSIC_VIDEO_GALLERY: Array<{ id: string; title: string }> = [
  // ── NEWEST DROP (Sept 2026) ──
  { id: "p6gPljLI5xM", title: "Our First Movie Trailer | Official AI Movie Trailer | AIWebTools.ai" },
  { id: "Ag0bWNnStTY", title: "September Drop I | Official AI Music Video | AIWebTools.ai" },
  // ── AUGUST 25 MTV DROP (newest — play FIRST in the 9:16 reel) ──
  { id: "v9a0cOxhY78", title: "August 25 Drop I | Official AI Music Video | AIWebTools.ai" },
  { id: "X-0Cl058cTk", title: "August 25 Drop II | Official AI Music Video | AIWebTools.ai" },
  { id: "-uUlUdFR08Q", title: "August 25 Drop III | Official AI Music Video | AIWebTools.ai" },
  { id: "o2VlFxD70GA", title: "August 25 Drop IV | Official AI Music Video | AIWebTools.ai" },
  { id: "ha_QEfOehoA", title: "August 25 Drop V | Official AI Music Video | AIWebTools.ai" },
  { id: "LQtf8yVClhE", title: "August 25 Drop VI | Official AI Music Video | AIWebTools.ai" },
  { id: "2tQnaFcB0y4", title: "August 25 Drop VII | Official AI Music Video | AIWebTools.ai" },
  { id: "yIPRE87hQv0", title: "August 25 Drop VIII | Official AI Music Video | AIWebTools.ai" },
  { id: "a5GbJ0S2U70", title: "August 25 Drop IX | Official AI Music Video | AIWebTools.ai" },
  { id: "oL482MS4hCI", title: "August 25 Drop X | Official AI Music Video | AIWebTools.ai" },
  { id: "hCtIYYPOmdY", title: "August 25 Drop XI | Official AI Music Video | AIWebTools.ai" },
  { id: "jZ13Ncw6W0s", title: "August 25 Drop XII | Official AI Music Video | AIWebTools.ai" },
  { id: "4xyNSRECxfw", title: "August 25 Drop XIII | Official AI Music Video | AIWebTools.ai" },
  { id: "VTxYIsf4Iwk", title: "August 25 Drop XIV | Official AI Music Video | AIWebTools.ai" },
  { id: "i7DZJehacFQ", title: "August 25 Drop XV | Official AI Music Video | AIWebTools.ai" },
  { id: "SqVokilhINk", title: "August 25 Drop XVI | Official AI Music Video | AIWebTools.ai" },
  { id: "PzQoBSy95Q0", title: "August 25 Drop XVII | Official AI Music Video | AIWebTools.ai" },
  { id: "uvzpWJrFdAE", title: "August 25 Drop XVIII | Official AI Music Video | AIWebTools.ai" },
  { id: "ePzXHHOECL0", title: "August 25 Drop XIX | Official AI Music Video | AIWebTools.ai" },
  { id: "Wg-_4PfnWpM", title: "August 25 Drop XX | Official AI Music Video | AIWebTools.ai" },
  { id: "S_g_gsKQAlI", title: "August 25 Drop XXI | Official AI Music Video | AIWebTools.ai" },
  { id: "vJB1UvILy60", title: "August 25 Drop XXII | Official AI Music Video | AIWebTools.ai" },
  { id: "s2UBXxdNNc4", title: "August 25 Drop XXIII | Official AI Music Video | AIWebTools.ai" },
  { id: "PY51wcMiPe4", title: "August 25 Drop XXIV | Official AI Music Video | AIWebTools.ai" },
  { id: "QyFiTVRV-wg", title: "August 25 Drop XXV | Official AI Music Video | AIWebTools.ai" },
  { id: "1V3WsMYVJ9Y", title: "August 25 Drop XXVI | Official AI Music Video | AIWebTools.ai" },
  { id: "TJA23SQmTu0", title: "August 25 Drop XXVII | Official AI Music Video | AIWebTools.ai" },
  // ── MTV LINE-UP (newest drops — play FIRST in the 9:16 reel) ──
  // ── SEPT 2026 CHANNEL DROPS (newest first) ──
  { id: "qUpLvFHen5A", title: "From The Mic To The Wings — Chains Break, An Angel Rises | Cinematic AI Short — MTVai" },
  { id: "SCDnLP_eHjw", title: "She Wears The Orbit Like A Halo — Awakening Eyes I | Cinematic AI Music Video — MTVai" },
  { id: "mfiaPP_KsUk", title: "The Second Time She Opened Her Eyes — Awakening Eyes II | Cinematic AI Music Video — MTVai" },
  { id: "GwD8vUfqbk8", title: "I AM — Truman's Great Work | Spiritual Awakening Short — MTVai" },
  { id: "F4XsbcHSSRY", title: "The House Always Wins — Reaper At The Roulette Wheel | Dark Cinematic AI Short — MTVai" },
  { id: "gKy2xgjM0pk", title: "Roses Oh Roses (He Weighs Your Heart) | Original AI Music Video — MTVai" },
  { id: "qZMrjyK1RBk", title: "Black Sun Flames — Angels Under The Skin (Single Art) | AI Music Visual — MTVai" },
  { id: "NtFdPNzF3To", title: "A Cowboy Tip At The Cemetery Gate — A Small Goodbye | Cinematic AI Short — MTVai" },
  { id: "-RahM5FrpEE", title: "They Don't Fight What Isn't A Threat — Warrior Of Light | Cinematic AI Short — MTVai" },
  { id: "GZi7u4D0SoY", title: "Behind The Wings And Armor Lies A Heart — Kneeling Angel Warrior | Cinematic AI Short — MTVai" },
  { id: "pBjW2-KcdTk", title: "Imagine Hiding From The One Who Made The Dirt — Billionaire Bunkers | Faith Humor Short — MTVai" },
  { id: "z1NXY1Ij3AU", title: "Angels Under The Skin | Original AI Music Video | AIWebTools.ai" },
  { id: "x_3KikrfxjY", title: "You Feel That Shift On The Inner Dimensions? The Spirit Realm Is Growing Stronger | MTVai" },
  { id: "9166G52u-Uc", title: "Cosmic Guardian Over Earth | Matrix Awakening Visual — MTVai" },
  { id: "0pUdCyEnG0U", title: "Take Back Your Mind — Fear Has Lived There Long Enough | Warrior Short — MTVai" },
  { id: "Sq7RUA0RGr0", title: "But God Is Around Them | When Trouble Surrounds You — MTVai" },
  { id: "CoRSsWqloIw", title: "Dollars Rain On The Trenches — War, Money & The Cosmos Within | Cinematic AI Music Video — MTVai" },
  { id: "5fwOsWFyaYA", title: "Cyberpunk Music Video — Dystopian Performance & The Woman In Red | AI Music Video — MTVai" },
  { id: "aWBKop6uEAQ", title: "Angels Singing Into The Black Hole — Cosmic Duet | AI Music Video — MTVai" },
  { id: "vnwACVKL4Ro", title: "Angels, Fire & The Glowing Tree | Mystical AI Music Video — MTVai" },
  { id: "p4DvTD2kj4k", title: "Secrets Are Best Unknown — Gothic Cathedral On Fire | AI Music Video — MTVai" },
  { id: "AANfmdp0YJ4", title: "Sacred Geometry & The Glowing-Eyed Girl | Indie Sci-Fi Pop AI Music Video — MTVai" },
  { id: "0KxCp2J4SrE", title: "Find Yourself — The King, The Snow & The Singer | Cinematic AI Music Video — MTVai" },
  { id: "IejM0Oh7le4", title: "The System Releases The Briefcase Men | Rebellious AI Music Video — MTVai" },
  { id: "-A5FaxQ6pNE", title: "Through The Cosmic Gateway — Yin-Yang, Tree Of Life & The Universe Within | AI Music Video — MTVai" },
  { id: "wWHdaWMXMy4", title: "Earth Angels — The Integration Is Complete | Spiritual Light AI Music Video — MTVai" },
  { id: "b7o-pnMnxLI", title: "The Angel At The End Of The Hallway — Heavenly Portal | AI Music Video — MTVai" },
  { id: "kplO_kfCU_Y", title: "Massive Explosion Erupts Over The Refinery | Cinematic AI Short — MTVai" },
  { id: "c3DWHpDNUEs", title: "Supposed 1960s Alien Interview — Are We Being Protected From The Truth? | MTVai" },
  { id: "-tvcBZvHsys", title: "When Your Spirit Team Checks In On The Energy Shifts | Funny Spiritual Short — MTVai" },
  { id: "Xh6ok-KJrKE", title: "MARVE: Did You See That Angel? | AI Sci-Fi Film Scene — MTVai" },
  { id: "ahsqLap-8UQ", title: "DOOMSCROLL WITH ME | AI Satire on Algorithm Culture | AIWebTools.ai" },
  { id: "WW2K0z0ID0E", title: "MARVE | AWT Production (Teaser) | AIWebTools.app" },
  { id: "LKEpDPDxTsc", title: "Two Friends, One City Night | Cinematic Urban AI Short — MTVai" },
  { id: "Aayk_T5mSvI", title: "Lego Spider-Man & The Cathedral | Patriotic Stop-Motion AI Short — MTVai" },
  { id: "s7yeCAExpzA", title: "Holy Frog Father: Quantum Leaping Somewhere Else | Funny AI Frog Short — MTVai" },
  { id: "1el6IjnR7W0", title: "Holy Frog Father: I've Seen How It Ends | Funny AI Frog Short — MTVai" },
  { id: "w6Cakt3jJLw", title: "Holy Frog Father: You'll Be Okay | Funny AI Frog Short — MTVai" },
  { id: "mSJtr_jW3vY", title: "AIWEBTOOLS – Newest Drop | Official AI Music Video | AIWebTools.ai" },
  { id: "MMpCWkhjuas", title: "AIWEBTOOLS – Newest Drop | Official AI Music Video | AIWebTools.ai" },
  { id: "IWijCkZUmrg", title: "AIWEBTOOLS – Newest Drop | Official AI Music Video | AIWebTools.ai" },
  { id: "RSovmNDLSnM", title: "Relatable Movie Scenes | Official AI Music Video | AIWebTools.ai" },
  { id: "KB1sRHXUUps", title: "Truth So Ya Know | Official AI Music Video | AIWebTools.ai" },
  { id: "LXXPC-1lgOQ", title: "AIWEBTOOLS – Newest Drop | Official AI Music Video | AIWebTools.ai" },
  { id: "rXMTjCFycPM", title: "AIWEBTOOLS – Newest Drop | Official AI Music Video | AIWebTools.ai" },
  { id: "cxJMzuv_ccQ", title: "AIWEBTOOLS – Newest Drop | Official AI Music Video | AIWebTools.ai" },
  { id: "a9rRZzIsbiY", title: "Revelations Nearing Midnight | Original AI Music Video | AIWebTools.ai" },
  { id: "n6y0lqJym0c", title: "AIWEBTOOLS – Newest Drop | Official AI Music Video | AIWebTools.ai" },
  { id: "_O0G0oFO-GQ", title: "AIWEBTOOLS – Newest Drop | Official AI Music Video Short | AIWebTools.ai" },
  // ── NEW MTV INTERLUDES / SHORTS (9:16 drops) ──
  { id: "c_15QhCFLGs", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai" },
  { id: "-5Cl-Vk3ShI", title: "AIWEBTOOLS – Newest Drop | Official AI Music Video | AIWebTools.ai" },
  { id: "Tv5yo-2n5Rc", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai" },
  { id: "09CvnM4ZJAg", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai" },
  { id: "EkiBNZ4orfI", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai" },
  { id: "H9PTc_hzsM8", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai" },
  { id: "IAP77Tl0izc", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai" },
  { id: "3wA9elcCEnE", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai" },
  { id: "mAsHosw2kwM", title: "August 3 Visions I | AI Music Video Short | AIWebTools.ai" },
  { id: "IvFZGb7t0aw", title: "August 3 Visions II | AI Music Video Short | AIWebTools.ai" },
  { id: "rByfuaw2BL8", title: "August 3 Visions III | AI Music Video Short | AIWebTools.ai" },
  { id: "4mMGTriG0Fc", title: "August 3 Visions IV | AI Music Video Short | AIWebTools.ai" },
  { id: "Pcs6KNM0loI", title: "August 3 Visions V | AI Music Video Short | AIWebTools.ai" },
  { id: "YHNRvs6g7zg", title: "August 3 Visions VI | AI Music Video Short | AIWebTools.ai" },
  { id: "E9MiAmubY7I", title: "August 3 Visions VII | AI Music Video Short | AIWebTools.ai" },
  { id: "j1O8TpqWWnU", title: "August 3 Visions VIII | AI Music Video Short | AIWebTools.ai" },
  { id: "-k9D5MyN2Y8", title: "August 3 Visions IX | AI Music Video Short | AIWebTools.ai" },
  { id: "036PVfmjjyA", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai" },
  { id: "OcgWzQEZO74", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai" },
  { id: "TXamH1b-m30", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai" },
  { id: "JNAZuKKxHmk", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai" },
  { id: "WZpSsFrMt-g", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai" },
  { id: "uKxiK2ZqyVw", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai" },
  { id: "3sMNbMV5mnU", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai" },
  { id: "auJbpTABYUo", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai" },
  { id: "jmaMZuPgdiM", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai" },
  { id: "qIFhp8gudjw", title: "August 3 Visions X | AI Music Video Short | AIWebTools.ai" },
  { id: "oUeh_EYb-HM", title: "August 3 Visions XI | AI Music Video Short | AIWebTools.ai" },
  { id: "8Ax-GpQJ2ZQ", title: "August 3 Visions XII | AI Music Video Short | AIWebTools.ai" },
  { id: "EcQnby6_EhA", title: "August 3 Visions XIII | AI Music Video Short | AIWebTools.ai" },
  { id: "dno3F-SQr2I", title: "August 3 Visions XIV | AI Music Video Short | AIWebTools.ai" },
  { id: "PktMrkD89fs", title: "AIWEBTOOLS Interlude | AI Commercial Short | AIWebTools.ai" },
  { id: "Lc0JUBiX6Zo", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai" },
  { id: "uGLay-OBpxg", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai" },
  { id: "Hng_A12fYH4", title: "AIWEBTOOLS Interlude | AI Commercial Short | AIWebTools.ai" },
  { id: "WAvc7xLrpkc", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai" },
  { id: "ibCTQA_Eqs4", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai" },
  { id: "3_jsSNXHcts", title: "AIWEBTOOLS Interlude | AI Commercial Short | AIWebTools.ai" },
  { id: "p9H1gdFzA_A", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai" },
  { id: "iOlicCLocXY", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai" },
  { id: "bfiAnkR6OC8", title: "AIWEBTOOLS Interlude | AI Commercial Short | AIWebTools.ai" },
  { id: "-F7iwTW5NOY", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai" },
  { id: "_lgs2sXVyfs", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai" },
  { id: "Wd7mQHMU2yY", title: "AIWEBTOOLS Interlude | AI Commercial Short | AIWebTools.ai" },
  { id: "zVfi5UkMjTM", title: "Cosmic Divine Dimensions Inside Us – AI Music Video | AIWebTools.ai _OFFICAL MUSIC VIDEO_  GALACTICA" },
  { id: "I6kOI_q0aHE", title: "Mirror Mirror | Original AI Music Video | AIWebTools.ai" },
  { id: "ZIr6c-fY9fs", title: "Just A Dream Baby | Original AI Music Video | AIWebTools.ai" },
  { id: "uGkb2zOYKSk", title: "God Is Light | Original AI Music Video | AIWebTools.ai" },
  { id: "CCNMLCJr41c", title: "Nameless | Original AI Music Video | AIWebTools.ai" },
  { id: "0YLdn4k5TCE", title: "Once More | Original AI Music Video | AIWebTools.ai" },
  { id: "0oHdDEbPMyo", title: "Mirror Man | Original AI Music Video | AIWebTools.ai" },
  { id: "1RQx5iQNiNQ", title: "Chaos Order | Original AI Music Video | AIWebTools.ai" },
  { id: "6OlRbGLY_Z8", title: "Cosmic Light | Original AI Music Video | AIWebTools.ai" },
  { id: "J1dqyotA-X4", title: "I Reject | Original AI Music Video | AIWebTools.ai" },
  { id: "ZjLyv3kHtOU", title: "Candy Cane Rain | Original AI Music Video | AIWebTools.ai" },
  { id: "vnIOMTuA7Ys", title: "The Spark | Original AI Music Video | AIWebTools.ai" },
  { id: "j1UWJuVAaZg", title: "Life Is But A Dream | Original AI Music Video | AIWebTools.ai" },
  { id: "UFEXSiIbN2U", title: "The Resistance | Original AI Music Video | AIWebTools.ai" },
  { id: "hPIfU-M2DiM", title: "Truth Algorithm | Original AI Music Video | AIWebTools.ai" },
  { id: "cHnRg68x-T0", title: "Tick Tock | Original AI Music Video | AIWebTools.ai" },
  { id: "bQ4wl2QVKtQ", title: "Secrets You Weren't Supposed to Know | Original AI Music Video | AIWebTools.ai" },
  { id: "N7I-ARetgzs", title: "Where Did You Go | Original AI Music Video | AIWebTools.ai" },
  { id: "aUUn0bODxJ0", title: "Down By The River | Original AI Music Video | AIWebTools.ai" },
  { id: "Uvd8xBli20w", title: "What's the Plan | Original AI Music Video | AIWebTools.ai" },
  { id: "tZXaKaCPiUw", title: "A Whole Another Round | Original AI Music Video | AIWebTools.ai" },
  { id: "W-j8E3WQch8", title: "Automobile GPT | Original AI Music Video | AIWebTools.ai" },
  { id: "oGetKTwsTec", title: "Afterlife Out of Control | Original AI Music Video | AIWebTools.ai" },
  { id: "4b29b5lJhIg", title: "Purpose | Original AI Music Video | AIWebTools.ai" },
  { id: "GKjxLY7sIWQ", title: "Defense Mode | Original AI Music Video | AIWebTools.ai" },
  { id: "FmXXrKxnh9U", title: "Singularity Rise | Original AI Music Video | AIWebTools.ai" },
  { id: "91PvTue2Zr0", title: "He Who Has No Name | Original AI Music Video | AIWebTools.ai" },
  { id: "J9A44q6pXOY", title: "Tax Break | Original AI Music Video | AIWebTools.ai" },
  { id: "xvcu_ALb3N0", title: "Burn It Flat | Original AI Music Video | AIWebTools.ai" },
  { id: "LThRs-T8big", title: "Neon Dreams | Original AI Music Video | AIWebTools.ai" },
  { id: "DkVtqUT581A", title: "God Mode GPT | Original AI Music Video | AIWebTools.ai" },
  { id: "OcFYWWYEoYk", title: "Unlock Your F'kn Dreams | Original AI Music Video | AIWebTools.ai" },
  { id: "brKREzLfgjU", title: "Strange | Original AI Music Video | AIWebTools.ai" },
  { id: "mQm6KsVGFSs", title: "Sunshine Daydream Open Your Eyes | Original AI Music Video | AIWebTools.ai" },
  // ── MTV LINE-UP (latest expansion drop) ──
  { id: "bMi4PGWzExk", title: "One Mankind | Original AI Music Video | AIWebTools.ai" },
  { id: "vxGi31tkz3Y", title: "Welcome to America | Original AI Music Video | AIWebTools.ai" },
  { id: "EBBw-cklCLk", title: "The Spark Within | Original AI Music Video | AIWebTools.ai" },
  { id: "C8nPl8IWHIw", title: "It's Just In The Code | Original AI Music Video | AIWebTools.ai" },
  { id: "OFQX2Ew_81o", title: "AIWEBTOOLS – Cosmic Uprising: Soul Reclamation (Official AI Music Video)" },
  { id: "KHdIFY7HrB4", title: "Got No GPT | Original AI Music Video | AIWebTools.ai - first music video i made back in the day" },
  { id: "pP2204ZbUHY", title: "The Witness | Original AI Music Video | AIWebTools.ai" },
  { id: "FmATqYvL0IY", title: "Cosmic Light In You | Original AI Music Video | AIWebTools.ai" },
  { id: "_D-tw9BAoxk", title: "AIWEBTOOLS – Your Plastic Face | The Mask Of Truth (Official AI Music Video)" },
  { id: "1XY2eEH5elw", title: "AIWEBTOOLS – Where Did We Go | The Resistance Anthem (Official AI Music Video)" },
  { id: "oR-aWyv1Ktg", title: "Father Of Light | Original AI Music Video | AIWebTools.ai" },
  { id: "9IsuTqEKn4o", title: "These Aren't Theories | Original AI Music Video | AIWebTools.ai" },
  { id: "MA6mGk9tRAM", title: "AIWEBTOOLS – AI Justice & War Drums: Metaphysical Uprising (Official AI Music Video)" },
  { id: "TvwM3Kkyrb0", title: "AIWEBTOOLS – Legends Bust The System: Chaplin, Marley & Monroe | Official AI Music Video" },
  { id: "6owuUcQ4mF0", title: "Automobile GPT – Any Car. Any Question. Real Results. | Official AI Music Video | AIWebTools.ai" },
  { id: "1MGu02bRTcc", title: "AIWEBTOOLS – GPT 4o1 Is The Prison Of The Mind | Singularity Uprising (Official AI Music Video)" },
  { id: "7qIfC0ZPIZo", title: "Multitasker GPT | Original AI Music Video | AIWebTools.ai" },
  { id: "jfZq0Bjgfc4", title: "Taxes GPT | Original AI Music Video | AIWebTools.ai" },
  { id: "vE_N6r4dOL0", title: "AIWEBTOOLS – To Become One: The Infinite Loop (Official AI Music Video)" },
  { id: "A16W7eADboQ", title: "Ivy Ridge Nightflair | Original AI Music Video | AIWebTools.ai" },
  { id: "U7R_6FRwK1Q", title: "AIWEBTOOLS – The Invisible Frequency | My Name Is Irrelevant (Official AI Music Video)" },
  { id: "Ja2auKcdzHg", title: "AIWEBTOOLS – Digital Chains: The Algorithm's Grasp (Official AI Music Video)" },
  // ── MTV LINE-UP (fresh expansion drop) ──
  { id: "eIwAbvwXNVc", title: "BEDROOM COSMOS EL TRUMAN - AN AI MUSIC VIDEO BY AIWEBTOOLS.AI" },
  { id: "AOI0K3XyM20", title: "I AM ANOTHER YOU Testimony music video - A MUSIC VIDEO CREATED BY AIWEBTOOLS.AI - MTVai.live X-ODDLY" },
  // ── VISUAL MUSIC VIDEOS (real cinematic clips, lead the reel) ──
  { id: "eG-TvPPKBpw", title: "pull it - rap video - 9-11 tribute art by aiwebtools.ai" },
  { id: "3XaTLuJ0kak", title: "Manifest dream - a music video by aiwebtools.ai" },
  { id: "RVBmL7FEtQk", title: "manifest crossbow katana charm - ai jazz music video" },
  { id: "htVLYZPHehk", title: " - Abracadabra" },
  { id: "bBZT8sPWvRY", title: "Same Light Different Eyes - AN AI MUSIC VIDEO CREATED BY AIWEBTOOLS.AI" },
  { id: "AFwPVOQV0SE", title: "My name is irrelevant. - an AI generated music video by aiwebtools.ai (shortened)" },
  { id: "M5l6VJAh2-Y", title: "Ai Might be the Devil - By AiWebTools.ai" },
  { id: "TlAgmV_2hXs", title: "Mushroomhead style music video i made - by aiwebtools.ai" },
  { id: "bhC9aTQGbGI", title: "holodeck - Music video by aiwebtools.ai" },
  { id: "qxIYhAAkko8", title: "mirror mirror you see the fire in your dreams - A Music video by AiWebTools.Ai" },
  { id: "1yajmSLnPTs", title: "mirror mirror on the wall - A Music Video PRODUCTION BY AIWEBTOOLS.AI" },
  { id: "hKZhXxV8KiA", title: "TRUTH BREAKS THE ICE ONCE MORE - AIWEBTOOLS.AI" },
  { id: "VGZdXt3shq8", title: "left in this place - An Ai Musical Production of truth by Ai-WebTools.com - AIWEBTOOLS.AI" },
  { id: "c2UpKrW4IVM", title: "Tare Me Open - An Ai Generated Music Video Written and edited by AiWebTools.Ai" },
  { id: "W4grI_pqzbk", title: "chaos order spin spin spin - An Ai Generated Music Video by AiWebTools.Ai" },
  { id: "YzGrnpsScH0", title: "AND THIS IS WHERE IT ALL FALLS... AI MUSIC GENERATED VIDEO CREATED BY AIWEBTOOLS.AI" },
  { id: "IHY7AlYJhUc", title: "\"As They Blow It All Away\" - An AI Generated Music Video Written and Edited by AiWebTools.Ai" },
  { id: "i9e3pRXyP8s", title: "Tears Timeline- official music video by aiwebtools.ai" },
  { id: "lG1rMaImBNc", title: "\"Life is but a dream\" - Official Music Video by AiWebTools.Ai" },
  { id: "1y3zdPnJfQ4", title: "CherryPie Goodbye - official -AiWebTools.Ai" },
  { id: "i0zc0aeRCeI", title: "Something More - Official Ai Generated Music Video by AiWebTools.ai" },
  { id: "v8El2IdTwsE", title: "Plastic Face - Official AI GENERATED Music Video by AiWebTools.Ai" },
  { id: "bfRpZ5r88Zg", title: "Wake the F Up - A Music Video Created and Written by AiWebTools.Ai" },
  { id: "864_bIK9Feo", title: "Love or Fall - An Ai Generated Music video by AiWebTools.Ai #aimusicvideo #aiwebtools #aitools #awt" },
  { id: "cKHZ7X0qx_Y", title: "Not My Time - Official Music Video" },
  { id: "-MSiCn4Fts8", title: "My people are free...." },
  { id: "mg7F63-PN30", title: "WRONG WAY - AN AI GENERATED MUSIC VIDEO BY AIWEBTOOLS.AI" },
  { id: "EYnCtw9CsxQ", title: "Galactic Gambit AudioBook -The Angelic Watchers Written By Ai-WebTools.com - A Metaphorical Sci-Fi -" },
  { id: "QCJCKhbwxhA", title: "Gregorian - Nothing Else Matters (Live In Europe 2011)" },
  { id: "Twl5-MsgmoI", title: "SECRETS BEST UNKNOWN - (example art) Official Ai Generated Music Video - AiWebTools.AI" },
  { id: "1cnzF1bkq3o", title: "What's The Plan? - An Ai Generated Music Video by AiWebTools.Ai" },
  { id: "8afw8Tq94Pg", title: "deep inside remastered AI generated music video by aiwebtools.ai" },
  { id: "eAaXtMBYWYs", title: "The Empire Has Fallen - Truth Prevails  AiWebTools.AI - Those with eyes to see shall be free. WAKEUP" },
  { id: "cB3T05q4294", title: "Earth Monopoly - AI Generated Music by AiWebTools.ai" },
  { id: "LFMtWqoKqyI", title: "Candy Cane Rain - AIWEBTOOLS.AI" },
  { id: "us8qYI2plqg", title: "Prison Gates - Ai Music Generated by Ai-WebTools.com" },
  { id: "ZMxg9PMHmos", title: "Portal Mugsy Rap Suno" },
  // ── SUNO / LYRIC TRACKS (audio with lyrics on screen, play LAST) ──
  { id: "FHEWZkP_3ew", title: "its in the code polly" },
  { id: "KIqBIh6TZ04", title: "Cosmic Light Code Within" },
  { id: "UlYYh-8pjS8", title: "PORTAL THROUGH THE LIGHT" },
  { id: "NglQB5OVmqk", title: "Cosmic Code" },
  { id: "yZ9Jt1canjE", title: "Cosmic TRUTH within YOU right now" },
  { id: "O9n0tKbbI2E", title: "The Cosmic Light is Within You - An Ai Generated Song by AiWebTools.Ai" },
  { id: "-I0LGUP9xso", title: "Cosmic Light Inner Cosmos Rap" },
  { id: "6NeNA-KGz2s", title: "my eyes -suno" },
  { id: "siddzjKXd9o", title: "Rome fell once, Rome gonna fall again -suno" },
  { id: "0IfbFWirwTg", title: "through my eyes - suno" },
  { id: "8y6irP9OPJ0", title: "Fall Again" },
  { id: "uPioA-r3Wyw", title: "Truth. Light. Now. abracadabra aiwebtools.ai" },
];

const MUSIC_VIDEO_TOOL_URL = "https://musicvideomakergpt.lovable.app/?via=aiwebtools";

// Keep slug behavior consistent across the app
const slugifyToolTitle = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// Detect if device is mobile
const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
};

// Extract YouTube video ID from various URL formats
const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
};

// Shuffle array using Fisher-Yates algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Build a randomized music-video order that ALWAYS leads with real cinematic
// music videos and pushes Suno-style lyric tracks to the back of the line.
// Within each group we shuffle so playback still feels fresh on every round.
export const buildMusicVideoOrder = <T extends { id: string; title: string }>(gallery: T[]): T[] => {
  const seen = new Set<string>();
  const unique = gallery.filter((video) => {
    if (seen.has(video.id)) return false;
    seen.add(video.id);
    return true;
  });
  const isShort = (video: T) => /\b(short|interlude|commercial)\b/i.test(video.title);
  const shorts = shuffleArray(unique.filter(isShort));
  const longVideos = shuffleArray(unique.filter((video) => !isShort(video)));
  const ordered: T[] = [];
  let longIndex = 0;
  let shortIndex = 0;

  while (longIndex < longVideos.length || shortIndex < shorts.length) {
    for (let count = 0; count < 2 && longIndex < longVideos.length; count += 1) {
      ordered.push(longVideos[longIndex]);
      longIndex += 1;
    }
    if (shortIndex < shorts.length) {
      ordered.push(shorts[shortIndex]);
      shortIndex += 1;
    }
  }

  return ordered;
};

const buildMusicOrder = (): typeof MUSIC_VIDEO_GALLERY => buildMusicVideoOrder(MUSIC_VIDEO_GALLERY);

// Priority "wow factor" tools that blow minds - these play FIRST
const WOW_FACTOR_TOOLS = new Set([
  // Creative powerhouses
  "Book Writer GPT",
  "Movie Script Writer GPT", 
  "Movie Scriptwriter GPT",
  "Movie Scene Maker GPT",
  "Movie Maker Studio AI SUITE",
  "Music Video Maker AI Studio",
  "Children's Picture Book Maker GPT",
  "Playwriter GPT",
  "Podcast Script Writer GPT",
  
  // Mind-blowing educational
  "College Degree GPT",
  "Learn Any Course GPT",
  "Learn Any Skill GPT",
  "Home-Schooling Assistant GPT",
  "HomeSchool GPT",
  
  // Time & history experiences
  "Time Machine GPT",
  "Talk to History GPT",
  "Talk to the Gods GPT",
  "Resurrection GPT",
  "Titanic Resurrections GPT",
  "Native American History Time Machine GPT",
  "Historical Headlines GPT",
  
  // Space & exploration
  "Stellaris: AI Space Explorer",
  "Phenomenon Explorer AI Suite",
  
  // Self-sufficiency & survival - HELP THE MEEK THRIVE
  "Survivalist GPT",
  "Agronomus",
  "Agronomus AI Farming Expert",
  "Fisherman GPT",
  "Fungus GPT",
  "Fungus Whisperer GPT",
  "Home Renovator GPT",
  "Solar Land Assessor GPT",
  "Sustainable Futures GPT",
  "Food Quality Inspector GPT",
  
  // Automotive & practical life
  "Automobile GPT",
  
  // Health & wellness - EMPOWER THE PEOPLE
  "Personalized DR. GPT",
  "Veterinarian GPT",
  "Pet Care GPT",
  "Mental Wellness GPT",
  "Cannabis GPT",
  "Pharmaceutical Assistant GPT",
  
  // Financial empowerment
  "Trader GPT",
  "Taxes GPT",
  "Insurance Claims GPT",
  "Property Data Finder GPT",
  "Predictive Credit Score GPT",
  
  // Legal & civic empowerment - VOICE FOR THE VOICELESS
  "Public Defender GPT",
  "Legislation Writer GPT",
  "Legislator Link GPT",
  "Public Testimony Writer GPT",
  "Contract Review Bot",
  "Legal Draftsmith GPT",
  
  // Career & business
  "Resume & Job Finder Ai Suite",
  "Business Plan Generator GPT",
  "Startup Validator GPT",
  "Training Manual Generator GPT",
  "Grant Writer GPT",
  
  // Mind-expanding
  "GODMODE GPT",
  "Illuminous World Data Explorer GPT",
  "NEO MATRIX GPT",
  "Oraculum",
  "Fortune Teller GPT",
  "Dream Interpreter GPT",
  "Imagination Traveler GPT",
  
  // Unique & groundbreaking
  "ImmortalizeME",
  "ImmortalizeMe",
  "Nikola Tesla GPT",
  "Albert Einstein GPT",
  "Alan Watts GPT",
  "Mary Magdalene GPT",
  "Sophia Aeterna",
  
  // Professional game-changers
  "Engineering GPT AI Suite",
  "Data Research Analysis Report GPT",
  "Drill Baby Drill Ai Suite",
  
  // Creative design
  "Graphic & Cover Design GPT",
  "Tattoo Designer GPT",
  "RESTYLE ME GPT",
  "Coloring Book Generator GPT",
  
  // Investigation & analysis
  "Criminologist GPT",
  "Fact Checker GPT",
  "Indiana Archaeologist GPT",
  "Historical Apothecary GPT",
  "Alchemist Scientist GPT",
  
  // Social good & peace
  "Social Safety Net GPT",
  "Global Peace Restoration GPT",
  "UBI Strategist GPT",
  "Marriage Mender GPT",
  
  // Safety & emergency
  "Firefighter GPT",
  "Firearms Safety Instructor GPT",
  "Cyber Security GPT",
  
  // Collectibles & appraisal
  "Antique and Collectible Appraisal GPT",
  "Artwork & Vintage Appraisal GPT",
  "Material Valuation GPT",
]);

// Get shuffled tools with priority ordering - FRESH every page load
const getShuffledToolsWithVideos = (allTools: Tool[]): Tool[] => {
  // Always generate fresh random order (no caching)
  const toolsWithVideos = allTools
    .filter(tool => extractYouTubeId(tool.videoUrl || '') !== null);

  // Dedupe by YouTube video ID — multiple tools (e.g. Web3 .worldpeace /
  // .worldtrade domain pages) often share the same promo video. Keep only the
  // first occurrence so the pinned player never replays the same clip twice
  // in a row across different tool entries.
  const seenVideoIds = new Set<string>();
  const uniqueByVideo = toolsWithVideos.filter(tool => {
    const id = extractYouTubeId(tool.videoUrl || '');
    if (!id) return false;
    if (seenVideoIds.has(id)) return false;
    seenVideoIds.add(id);
    return true;
  });

  // Separate into priority tiers
  const wowFactorTools: Tool[] = [];
  const regularTools: Tool[] = [];

  uniqueByVideo.forEach(tool => {
    // Check if tool title matches any wow factor tool (case-insensitive partial match)
    const isWowFactor = Array.from(WOW_FACTOR_TOOLS).some(wowTitle => 
      tool.title.toLowerCase().includes(wowTitle.toLowerCase()) ||
      wowTitle.toLowerCase().includes(tool.title.toLowerCase())
    );
    
    if (isWowFactor) {
      wowFactorTools.push(tool);
    } else {
      regularTools.push(tool);
    }
  });
  
  // Shuffle each tier independently for variety
  const shuffledWow = shuffleArray(wowFactorTools);
  const shuffledRegular = shuffleArray(regularTools);
  
  // Wow factor tools first, then regular tools
  const result = [...shuffledWow, ...shuffledRegular];
  
  // Store indices in session for navigation persistence only (not order persistence)
  try {
    const indices = result.map(tool => allTools.indexOf(tool));
    sessionStorage.setItem(SHUFFLED_TOOLS_KEY, JSON.stringify(indices));
  } catch {}
  
  return result;
};

// Persist current index to survive navigation
const getStoredIndex = (): number => {
  try {
    const stored = sessionStorage.getItem(CURRENT_INDEX_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
};

const setStoredIndex = (index: number) => {
  try {
    sessionStorage.setItem(CURRENT_INDEX_KEY, String(index));
  } catch {}
};

// Generate fresh shuffled list on each page load
let cachedToolsWithVideos: Tool[] | null = null;
let lastGenerationTime = 0;

const getToolsWithVideosCached = (allTools: Tool[]): Tool[] => {
  const now = Date.now();
  // Regenerate if more than 1 second since last generation (new page load)
  // or if not yet generated
  if (!cachedToolsWithVideos || (now - lastGenerationTime > 1000)) {
    cachedToolsWithVideos = getShuffledToolsWithVideos(allTools);
    lastGenerationTime = now;
    // Reset index to 0 for fresh experience
    setStoredIndex(0);
  }
  return cachedToolsWithVideos;
};

let toolsLoadPromise: Promise<Tool[]> | null = null;

const loadToolsWithVideos = async (): Promise<Tool[]> => {
  if (!toolsLoadPromise) {
    toolsLoadPromise = import("@/data/toolsData").then(({ allTools }) => getToolsWithVideosCached(allTools));
  }
  return toolsLoadPromise;
};

const PinnedVideoPlayer = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerMountedRef = useRef(false);
  const advanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pauseOtherYouTubePlayers = useCallback(() => {
    if (typeof document === 'undefined') return;
    const currentFrame = iframeRef.current;
    document
      .querySelectorAll<HTMLIFrameElement>('iframe[src*="youtube.com/embed"], iframe[src*="youtube-nocookie.com/embed"]')
      .forEach((frame) => {
        if (!frame?.contentWindow || frame === currentFrame) return;
        try {
          frame.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'mute' }), '*');
          frame.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo' }), '*');
        } catch {
          return;
        }
      });
  }, []);
  
  // Check if on homepage
  const isHomepage = location.pathname === "/" || location.pathname === "";
  const isToolDetailPage = useMemo(() => {
    const p = location.pathname || "";
    if (p.startsWith("/tool/")) return true;
    return false;
  }, [location.pathname]);
  
  // Check if closed this session
  const [isVisible, setIsVisible] = useState(true);
  
  // Wait for the user to scroll past the hero/search area on the homepage before
  // popping the pinned player open. Tool pages still use a small scroll threshold
  // so the player doesn't cover the primary tool media.
  const hasScrolledEnough = useScrollThreshold(isHomepage ? 180 : 80, {
    enabled: true,
    allowReset: false, // Once shown, stay shown
  });
  
  // Hide when user is viewing the main tool video on a detail page
  const [isMainVideoVisible, setIsMainVideoVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(true);
  
  // Persisted current index - survives navigation
  const [currentIndex, setCurrentIndex] = useState(getStoredIndex);
  
  // Try to start UNMUTED per Master's request. If browser blocks autoplay-with-sound,
  // user can tap unmute. We aggressively retry unMute commands on every load.
  const [isMuted, setIsMuted] = useState(false);
  const initialMuteEnforcedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Shuffled tools - kept in state so we can reshuffle on round wrap
  // (so every video plays once before any repeat)
  const [toolsWithVideos, setToolsWithVideos] = useState<Tool[]>([]);

  // Shuffled music-video order — every video plays once before any repeat.
  // Reshuffled when we wrap past the end so the next round is a fresh random order.
  const [musicOrder, setMusicOrder] = useState<typeof MUSIC_VIDEO_GALLERY>(() => buildMusicOrder());

  // ── Draggable pinned-player support ─────────────────────────────────────
  // The player is pinned by default. As soon as the user drags it, we switch
  // to free positioning so they can move it out of their way while still
  // watching. Drag handle = the title header bar.
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);

  const handleDragPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Don't start a drag from the close button or other interactive children
    const target = e.target as HTMLElement;
    if (target.closest('[data-no-drag]')) return;
    const rect = (e.currentTarget.parentElement as HTMLElement | null)?.getBoundingClientRect();
    if (!rect) return;
    dragStateRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: rect.left,
      originY: rect.top,
      moved: false,
    };
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch {}
  }, []);

  const handleDragPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const s = dragStateRef.current;
    if (!s || s.pointerId !== e.pointerId) return;
    const dx = e.clientX - s.startX;
    const dy = e.clientY - s.startY;
    if (!s.moved && Math.hypot(dx, dy) < 4) return;
    s.moved = true;
    const w = window.innerWidth;
    const h = window.innerHeight;
    // Clamp to viewport with a 220x220 worst-case footprint
    const newX = Math.max(0, Math.min(w - 60, s.originX + dx));
    const newY = Math.max(0, Math.min(h - 60, s.originY + dy));
    setDragPos({ x: newX, y: newY });
  }, []);

  const handleDragPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const s = dragStateRef.current;
    if (s && s.pointerId === e.pointerId) {
      try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
      dragStateRef.current = null;
    }
  }, []);

  // Brief "exploding code" burst when the user clicks MUSIC_GALLERY.exe
  const [musicBurst, setMusicBurst] = useState(false);

  // Mode: idle = show overlay with "Whatcha in the mood for?" buttons.
  // tools = play tool showcase videos (original behavior). music = 9:16 music videos.
  const [mode, setMode] = useState<'idle' | 'tools' | 'music'>(() => {
    try {
      const stored = sessionStorage.getItem(MODE_SESSION_KEY);
      if (stored === 'tools' || stored === 'music') return stored;
    } catch {}
    return 'idle';
  });

  useEffect(() => {
    try { sessionStorage.setItem(MODE_SESSION_KEY, mode); } catch {}
  }, [mode]);

  useEffect(() => {
    if (mode !== 'tools' || toolsWithVideos.length > 0) return;
    let cancelled = false;
    void loadToolsWithVideos()
      .then((tools) => {
        if (!cancelled) setToolsWithVideos(tools);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [mode, toolsWithVideos.length]);

  // Reset playlist index when switching modes so each gallery starts fresh
  const handleSelectMode = useCallback((next: 'tools' | 'music') => {
    setCurrentIndex(0);
    if (next === 'music') {
      setMusicOrder(buildMusicOrder());
    } else if (toolsWithVideos.length === 0) {
      void loadToolsWithVideos().then((tools) => setToolsWithVideos(tools)).catch(() => {});
    }
    setMode(next);
    userPausedRef.current = false;
    userMutePreferenceRef.current = false;
    setIsMuted(false);
    setIsPlaying(true);
    requestAnimationFrame(() => pauseOtherYouTubePlayers());
  }, [pauseOtherYouTubePlayers, toolsWithVideos.length]);

  // Active playlist length and current video for the chosen mode
  const isMusicMode = mode === 'music';
  const activeLength = isMusicMode ? musicOrder.length : toolsWithVideos.length;
  const currentTool: Tool | undefined = isMusicMode ? undefined : toolsWithVideos[currentIndex];
  const currentMusicVideo = isMusicMode ? musicOrder[currentIndex % musicOrder.length] : undefined;
  const currentVideoId = isMusicMode
    ? (currentMusicVideo?.id ?? null)
    : (currentTool ? extractYouTubeId(currentTool.videoUrl || '') : null);
  const currentTitle = isMusicMode
    ? (currentMusicVideo?.title ?? "AIWebTools Music Video")
    : (currentTool?.title ?? "");
  const currentEmoji = isMusicMode ? "🎵" : (currentTool?.emoji || "🤖");
  
  // Track if this is the first video load (to set initial mute state)
  const isFirstVideoRef = useRef(true);
  const userMutePreferenceRef = useRef<boolean | null>(null);
  // Tracks whether the user explicitly paused the current video so background
  // retry timers (unmute/playVideo loops) don't sneak it back to playing.
  const userPausedRef = useRef(false);

  // Handle mute/unmute via postMessage instead of iframe reload.
  // Send to ALL possible YouTube origins + wildcard for maximum mobile compatibility.
  const sendYTCommand = useCallback((command: string) => {
    if (!iframeRef.current?.contentWindow) return;
    const msg = JSON.stringify({ event: 'command', func: command });
    try {
      iframeRef.current.contentWindow.postMessage(msg, YT_EMBED_ORIGIN);
      iframeRef.current.contentWindow.postMessage(msg, YT_API_ORIGIN_FALLBACK);
      iframeRef.current.contentWindow.postMessage(msg, '*');
    } catch {
      return;
    }
  }, []);
  
  // Derive videoSrc SYNCHRONOUSLY from currentVideoId so the iframe never mounts
  // with a stale URL. This was the root cause of the "music button plays AI tools"
  // bug — the iframe was mounting with a previously-cached tool URL before a
  // useEffect could swap it to the music URL, briefly playing the wrong video.
  // Mute is controlled via postMessage (not src) so toggling it does not reload.
  const videoSrc = useMemo(() => {
    if (!currentVideoId) return "";
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `https://www.youtube.com/embed/${currentVideoId}?autoplay=1&mute=0&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1&playsinline=1&loop=0&vq=hd1080&hd=1&origin=${encodeURIComponent(origin)}&widget_referrer=${encodeURIComponent(origin)}`;
  }, [currentVideoId]);
  const lastVideoIdRef = useRef<string>(currentVideoId || "");
  
  // Persist index changes
  useEffect(() => {
    setStoredIndex(currentIndex);
  }, [currentIndex]);
  
  // React to video ID changes: kick mute/play retry loop. videoSrc itself is
  // derived synchronously above so no need to setVideoSrc here.
  useEffect(() => {
    if (!currentVideoId) return;
    if (currentVideoId === lastVideoIdRef.current) return;
    lastVideoIdRef.current = currentVideoId;

    const shouldMute = userMutePreferenceRef.current !== null
      ? userMutePreferenceRef.current
      : false;
    isFirstVideoRef.current = false;
    playerMountedRef.current = true;
    setIsMuted(shouldMute);

    if (!shouldMute) {
      pauseOtherYouTubePlayers();
      window.dispatchEvent(new CustomEvent('pinnedPlayerPlaying'));
      const retryDelays = [200, 400, 700, 1100, 1600, 2200, 3000, 4000, 5500];
      const timers = retryDelays.map(delay =>
        setTimeout(() => {
          if (userPausedRef.current) return;
          pauseOtherYouTubePlayers();
          sendYTCommand('unMute');
          sendYTCommand('playVideo');
        }, delay)
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [currentVideoId, pauseOtherYouTubePlayers, sendYTCommand]);

  // Sync mute state to iframe whenever isMuted changes
  useEffect(() => {
    if (!iframeRef.current || !playerMountedRef.current) return;
    const command = isMuted ? 'mute' : 'unMute';
    sendYTCommand(command);
    const retry = setTimeout(() => sendYTCommand(command), 300);
    return () => clearTimeout(retry);
  }, [isMuted, sendYTCommand]);

  // When video ID changes and user wants unmuted, force-send unmute
  // (covers the case where isMuted is already false so the above effect doesn't re-fire)
  useEffect(() => {
    if (!currentVideoId || !playerMountedRef.current) return;
    if (userMutePreferenceRef.current === false) {
      const timers = [800, 1500, 2500].map(d => setTimeout(() => {
        if (userPausedRef.current) return;
        sendYTCommand('unMute');
      }, d));
      return () => timers.forEach(clearTimeout);
    }
  }, [currentVideoId, sendYTCommand]);
  
  // Handle smooth fade animation when main video visibility changes
  useEffect(() => {
    // Only hide the pinned player when the user is actively viewing a tool's main video
    // (this event can fire from other embeds on the homepage, causing an "audio-only" bug)
    if (!isToolDetailPage) {
      setShouldShow(true);
      return;
    }

    setShouldShow(!isMainVideoVisible);
  }, [isMainVideoVisible, isToolDetailPage]);
  
  // Mute pinned player when tool page video starts playing
  useEffect(() => {
    const handleToolVideoPlaying = () => {
      // Mute pinned player when tool video plays - use postMessage for immediate effect
      setIsMuted(true);
      sendYTCommand('mute');
    };
    
    window.addEventListener('toolVideoPlaying', handleToolVideoPlaying);
    return () => {
      window.removeEventListener('toolVideoPlaying', handleToolVideoPlaying);
    };
  }, []);
  
  // Listen for main tool video visibility changes - with stable state management
  const visibilityDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastMainVideoVisibleRef = useRef(false);
  
  useEffect(() => {
    const handleToolVideoVisibility = (event: CustomEvent<{ isVisible: boolean }>) => {
      // Ignore these events unless we're on a tool detail page.
      // Prevents the pinned player from being hidden on the homepage while still playing audio.
      if (!isToolDetailPage) return;

      const newVisible = event.detail.isVisible;
      
      // Skip if no change
      if (lastMainVideoVisibleRef.current === newVisible) return;
      
      // Clear any pending update
      if (visibilityDebounceRef.current) {
        clearTimeout(visibilityDebounceRef.current);
      }
      
      // Apply with slight debounce to prevent flickering
      visibilityDebounceRef.current = setTimeout(() => {
        lastMainVideoVisibleRef.current = newVisible;
        setIsMainVideoVisible(newVisible);
      }, 100);
    };
    
    window.addEventListener('toolVideoVisibility', handleToolVideoVisibility as EventListener);
    return () => {
      window.removeEventListener('toolVideoVisibility', handleToolVideoVisibility as EventListener);
      if (visibilityDebounceRef.current) {
        clearTimeout(visibilityDebounceRef.current);
      }
    };
  }, [isToolDetailPage]);

  // NOTE: scroll threshold is handled by useScrollThreshold

  // Auto-advance function. Plays every video in the shuffled order before any
  // can repeat. When we wrap past the last video, invalidate the cache so the
  // next render generates a fresh random order for the new round.
  const advanceToNextVideo = useCallback(() => {
    setCurrentIndex(prev => {
      const next = prev + 1;
      if (isMusicMode) {
        if (next >= musicOrder.length) {
          // Reshuffle for a fresh random round — every video plays once before repeating.
          let fresh = buildMusicOrder();
          // Don't start the new round with the same video that just played.
          if (fresh.length > 1 && musicOrder[prev] && fresh[0].id === musicOrder[prev].id) {
            [fresh[0], fresh[1]] = [fresh[1], fresh[0]];
          }
          setMusicOrder(fresh);
          return 0;
        }
        return next;
      }
      if (next >= toolsWithVideos.length) {
        // Reshuffle the playlist for a brand-new random round — no recent repeats
        cachedToolsWithVideos = null;
        lastGenerationTime = 0;
          const fresh = getShuffledToolsWithVideos(toolsWithVideos);
        // Avoid starting the new round with the exact video that just played
        if (fresh.length > 1 && toolsWithVideos[prev] && fresh[0].title === toolsWithVideos[prev].title) {
          [fresh[0], fresh[1]] = [fresh[1], fresh[0]];
        }
        setToolsWithVideos(fresh);
        return 0;
      }
      return next;
    });
  }, [toolsWithVideos, isMusicMode, musicOrder]);

  // Track when video started to prevent premature skipping
  const videoStartTimeRef = useRef<number>(Date.now());
  const hasReceivedPlayStateRef = useRef(false);
  // Dynamic duration detection from YouTube iframe API
  const detectedDurationRef = useRef<number | null>(null);
  
  // Reset timing when video changes
  useEffect(() => {
    videoStartTimeRef.current = Date.now();
    hasReceivedPlayStateRef.current = false;
    detectedDurationRef.current = null; // Reset so we pick up new video's duration
    // New video = fresh play intent
    userPausedRef.current = false;
  }, [currentVideoId]);

  // Listen for YouTube iframe API messages to detect video end
  useEffect(() => {
    if (mode === 'idle') return;
    if (!isVisible || !hasScrolledEnough || activeLength === 0) return;

    let didAdvanceForVideo = false;

    const handleMessage = (event: MessageEvent) => {
      // YouTube sends messages when video state changes
      if (event.origin !== YT_EMBED_ORIGIN && event.origin !== YT_API_ORIGIN_FALLBACK) return;
      // CRITICAL: only react to messages from OUR iframe — other YouTube
      // iframes on the page (book carousel, tool pages) also post state
      // changes and were causing the pinned player to advance prematurely
      // when a different video on the page ended.
      if (!iframeRef.current || event.source !== iframeRef.current.contentWindow) return;

      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        
        // Capture video duration from YouTube's infoDelivery messages
        // YouTube automatically sends these with {currentTime, duration, ...}
        if (data?.info?.duration && data.info.duration > 0 && !detectedDurationRef.current) {
          detectedDurationRef.current = data.info.duration;
        }
        
        // Track when we receive a "playing" state (state 1)
        if (data?.event === "onStateChange" && data?.info === 1) {
          hasReceivedPlayStateRef.current = true;
          videoStartTimeRef.current = Date.now();
          didAdvanceForVideo = false;
          // If the user just paused, immediately re-pause so retry timers
          // or YouTube's own autoplay don't override the pause intent.
          if (userPausedRef.current) {
            sendYTCommand('pauseVideo');
          } else {
            setIsPlaying(true);
          }
        }
        if (data?.info?.playerState === 1) {
          hasReceivedPlayStateRef.current = true;
          videoStartTimeRef.current = Date.now();
          didAdvanceForVideo = false;
          if (userPausedRef.current) {
            sendYTCommand('pauseVideo');
          } else {
            setIsPlaying(true);
          }
        }
        if (data?.event === "onStateChange" && data?.info === 2) {
          setIsPlaying(false);
          // SMOOTH PLAYBACK: if YouTube spuriously pauses (buffering, ad
          // boundary, network hiccup) but the user did NOT press pause,
          // immediately resume so music videos play through end-to-end.
          if (!userPausedRef.current && isMusicMode) {
            setTimeout(() => {
              if (!userPausedRef.current) sendYTCommand('playVideo');
            }, 150);
          }
        }
        if (data?.info?.playerState === 2) {
          setIsPlaying(false);
          if (!userPausedRef.current && isMusicMode) {
            setTimeout(() => {
              if (!userPausedRef.current) sendYTCommand('playVideo');
            }, 150);
          }
        }
        
        // Only advance if video has been playing for at least 8 seconds
        // This prevents false "ended" signals during loading
        const timeSinceStart = Date.now() - videoStartTimeRef.current;
        // For music mode: require ~90% of the detected duration before
        // treating an "ended" signal as real. This prevents long music
        // videos from skipping early due to spurious state changes.
        const detected = detectedDurationRef.current;
        const MIN_PLAY_TIME = isMusicMode && detected
          ? Math.max(9000, detected * 1000 * 0.9)
          : 9000;
        
        // Check for video ended state (state 0 = ended)
        if (data?.event === "onStateChange" && data?.info === 0) {
          if (didAdvanceForVideo) return;
          if (hasReceivedPlayStateRef.current && timeSinceStart > MIN_PLAY_TIME) {
            didAdvanceForVideo = true;
            advanceToNextVideo();
          } else {
          }
          return;
        }
        
        // Also check for infoDelivery with playerState (0 = ended)
        if (data?.info?.playerState === 0) {
          if (didAdvanceForVideo) return;
          if (hasReceivedPlayStateRef.current && timeSinceStart > MIN_PLAY_TIME) {
            didAdvanceForVideo = true;
            advanceToNextVideo();
          }
          return;
        }
        
        // Check for onReady event to request state updates
        if (data?.event === "onReady" && iframeRef.current) {
          // Request the player to send state updates
          iframeRef.current.contentWindow?.postMessage(
            JSON.stringify({ event: 'listening' }),
            'https://www.youtube.com'
          );
        }
      } catch {
        // Ignore parse errors
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [isVisible, hasScrolledEnough, activeLength, mode, advanceToNextVideo, currentVideoId, isMusicMode]);

  // Reliable fixed-interval auto-skip: every video plays for ~28 seconds,
  // then advances to the next. The onStateChange "ended" listener above will
  // still trigger early advance for shorter clips. This guarantees the
  // carousel always moves forward and never gets stuck on long videos.
  useEffect(() => {
    if (!isVisible || !hasScrolledEnough || activeLength === 0) return;

    // Clear any existing timeout
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
    }

    // In music mode, let the full video play to completion (advance via ended event).
    // In tool showcase mode, keep the 15s rotation.
    if (isMusicMode) {
      return;
    }

    const AUTO_SKIP_MS = 15000; // 15 seconds per video per Master's request

    advanceTimeoutRef.current = setTimeout(() => {
      advanceToNextVideo();
    }, AUTO_SKIP_MS);

    return () => {
      if (advanceTimeoutRef.current) {
        clearTimeout(advanceTimeoutRef.current);
      }
    };
  }, [isVisible, hasScrolledEnough, activeLength, currentIndex, advanceToNextVideo, isMusicMode]);

  const handleNextVideo = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % activeLength);
  }, [activeLength]);

  const handlePrevVideo = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + activeLength) % activeLength);
  }, [activeLength]);

  const handleClose = useCallback(() => {
    try { sessionStorage.removeItem(SESSION_CLOSED_KEY); } catch {}
    setIsVisible(false);
  }, []);

  const handleToolClick = useCallback(() => {
    if (isMusicMode) {
      // Music videos aren't tool demos — send visitors to browse every category
      navigate('/main-category/ALL%20AI%20TOOLS');
      return;
    }
    if (!currentTool) return;
    
    // Generate URL slug from tool title
    const slug = slugifyToolTitle(currentTool.title);
    
    navigate(`/tool/${slug}`);
  }, [currentTool, navigate, isMusicMode]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      // Store user preference for subsequent videos
      userMutePreferenceRef.current = newMuted;
      // If unmuting pinned player, notify tool page video to mute
      if (!newMuted) {
        pauseOtherYouTubePlayers();
        window.dispatchEvent(new CustomEvent('pinnedPlayerPlaying'));
      }
      // Force-send command immediately on user gesture (critical for mobile Chrome)
      // User gesture context is required for unmuting on mobile browsers
      const command = newMuted ? 'mute' : 'unMute';
      sendYTCommand(command);
      // Extra retry specifically for mobile — gesture window is short
      setTimeout(() => sendYTCommand(command), 100);
      setTimeout(() => sendYTCommand(command), 500);
      return newMuted;
    });
  }, [sendYTCommand, pauseOtherYouTubePlayers]);

  const handlePlayVideo = useCallback(() => {
    pauseOtherYouTubePlayers();
    userMutePreferenceRef.current = false;
    setIsMuted(false);
    sendYTCommand('unMute');
    sendYTCommand('playVideo');
    window.dispatchEvent(new CustomEvent('pinnedPlayerPlaying'));
    [120, 350, 800, 1400].forEach(delay => {
      window.setTimeout(() => {
        sendYTCommand('unMute');
        sendYTCommand('playVideo');
      }, delay);
    });
  }, [sendYTCommand, pauseOtherYouTubePlayers]);

  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      userPausedRef.current = true;
      sendYTCommand('pauseVideo');
      setIsPlaying(false);
      // Re-assert pause shortly after in case a background timer fires playVideo.
      [120, 400, 900].forEach(d => window.setTimeout(() => sendYTCommand('pauseVideo'), d));
    } else {
      pauseOtherYouTubePlayers();
      userPausedRef.current = false;
      userMutePreferenceRef.current = false;
      setIsMuted(false);
      sendYTCommand('unMute');
      sendYTCommand('playVideo');
      setIsPlaying(true);
      [150, 500, 1200].forEach(d => window.setTimeout(() => {
        if (userPausedRef.current) return;
        sendYTCommand('unMute');
        sendYTCommand('playVideo');
      }, d));
    }
  }, [isPlaying, sendYTCommand, pauseOtherYouTubePlayers]);

  const handleIframeLoad = useCallback(() => {
    playerMountedRef.current = true;
    if (!isMuted) {
      [100, 300, 700, 1200, 2200].forEach(delay => {
        window.setTimeout(() => {
          if (userPausedRef.current) return;
          pauseOtherYouTubePlayers();
          sendYTCommand('unMute');
          sendYTCommand('playVideo');
        }, delay);
      });
    }
  }, [isMuted, sendYTCommand, pauseOtherYouTubePlayers]);

  // Don't render if not on homepage, permanently closed, no tools, or haven't scrolled past hero yet
  if (!isHomepage || !isVisible || !hasScrolledEnough) {
    return null;
  }
  if (mode === 'tools' && toolsWithVideos.length === 0) return null;
  // Once a mode is chosen, require a video to render
  if (mode !== 'idle' && (!currentVideoId || !videoSrc)) {
    return null;
  }

  const playerUi = (
    <div
      className={shouldShow ? "opacity-100" : "opacity-0 pointer-events-none"}
      style={{
        // CRITICAL: Inline fixed positioning - cannot be overridden by CSS
        position: 'fixed',
        // Responsive sizing & safe-area support (iOS notch, etc.)
        width: isMusicMode ? "clamp(130px, 30vw, 180px)" : "clamp(148px, 36vw, 208px)",
        // Lift the player on mobile so the idle mode buttons (esp. MUSIC_GALLERY.exe)
        // never get clipped by the bottom of the viewport / nav UI.
        ...(dragPos
          ? { top: `${dragPos.y}px`, left: `${dragPos.x}px` }
          : {
              bottom: mode === 'idle'
                ? "calc(4.5rem + env(safe-area-inset-bottom, 0px))"
                : "calc(1rem + env(safe-area-inset-bottom, 0px))",
              left: "calc(0.5rem + env(safe-area-inset-left, 0px))",
            }),
        // Portal + max z-index prevents the "audio-only" bug caused by stacking contexts/overlays.
        zIndex: 2147483647,
        transition: "opacity 0.3s ease-out",
        visibility: shouldShow ? "visible" : "hidden",
        pointerEvents: shouldShow ? "auto" : "none",
        isolation: "isolate",
      }}
    >
      <div 
        className="bg-gray-900/95 rounded-lg border border-cyan-500/40 overflow-hidden shadow-2xl"
        style={{
          boxShadow: '0 0 15px rgba(34, 211, 238, 0.3), 0 0 30px rgba(168, 85, 247, 0.15), 0 6px 24px rgba(0, 0, 0, 0.4)'
        }}
      >
        {musicBurst && (
          <>
            <style>{`
              @keyframes mtvLogoPop  { 0% { opacity:0; transform:scale(0.75);} 45% { opacity:1; transform:scale(1.08);} 100% { opacity:0; transform:scale(1.2);} }
            `}</style>
            <div className="pointer-events-none fixed inset-0 z-[2147483646] flex items-center justify-center">
              <img
                src={mtvAiWebToolsLogo}
                alt=""
                aria-hidden
                draggable={false}
                className="w-32 h-32 drop-shadow-[0_0_26px_rgba(168,85,247,0.85)]"
                style={{ animation: "mtvLogoPop .42s ease-out forwards" }}
              />
            </div>
          </>
        )}
        {/* Tool title header with X button - allow wrap */}
        <div
          className="flex items-start justify-between gap-1 px-1.5 py-1 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-cyan-500/30 cursor-grab active:cursor-grabbing touch-none select-none"
          onPointerDown={handleDragPointerDown}
          onPointerMove={handleDragPointerMove}
          onPointerUp={handleDragPointerUp}
          onPointerCancel={handleDragPointerUp}
          title="Drag to move"
        >
          <p 
            className="text-[10px] font-bold leading-[1.15] flex-1 line-clamp-3 break-words"
            style={{
              color: '#FFD700',
              textShadow: '0 0 6px #FFD700'
            }}
            title={currentTitle}
          >
            {mode === 'idle'
              ? 'AI Tool Commericals / MTVai'
              : `${currentEmoji} ${currentTitle}`}
          </p>
          <button
            onClick={handleClose}
            data-no-drag
            className="w-4 h-4 flex items-center justify-center rounded bg-black/40 hover:bg-red-500/70 text-white/60 hover:text-white transition-colors flex-shrink-0"
            title="Close"
          >
            <X className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* Video Container - stable iframe that doesn't remount on navigation */}
        <div
          className="group relative bg-black"
          style={{
            // In idle mode let the content (3 buttons + label) define the height
            // so MUSIC_GALLERY.exe never gets clipped on small mobile screens.
            aspectRatio: mode === 'idle' ? 'auto' : (isMusicMode ? '9 / 16' : '16 / 9'),
            minHeight: mode === 'idle' ? undefined : '70px',
          }}
        >
          {mode === 'idle' ? (
            <div className="relative flex flex-col items-center justify-center gap-1.5 p-1.5 bg-black overflow-hidden">
              {/* Lightweight Matrix background */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                  background:
                    "repeating-linear-gradient(180deg, rgba(0,255,70,0.18) 0 1px, transparent 1px 3px)",
                  textShadow: "0 0 6px #00ff41",
                }}
              />
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none font-mono text-[8px] leading-[9px] text-[#00ff41]/70 select-none overflow-hidden whitespace-pre"
                style={{
                  textShadow: "0 0 4px #00ff41",
                }}
              >
                {"01010\n10110\n11001\n01110\n10011\n01101\n10100\n01011\n11010\n00111\n10101\n01100\n11011\n00101\n10010\n01001"}
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

              <p
                className="relative z-10 text-[9px] uppercase tracking-[0.2em] text-center font-mono font-bold"
                style={{ color: "#00ff41", textShadow: "0 0 8px #00ff41" }}
              >
                &gt; select_mode
              </p>

              <button
                onClick={() => handleSelectMode('tools')}
                className="relative z-10 group w-full px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#00ff41] bg-black/70 border border-[#00ff41]/60 hover:bg-[#00ff41]/15 hover:border-[#00ff41] active:scale-95 transition-all"
                style={{
                  clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)",
                  textShadow: "0 0 6px #00ff41",
                  boxShadow: "0 0 10px rgba(0,255,65,0.35), inset 0 0 8px rgba(0,255,65,0.15)",
                }}
                title="Browse our AI tools showcase"
              >
                ▶ AI_TOOLS.exe
              </button>
              <button
                onClick={() => {
                  setMusicBurst(true);
                  window.setTimeout(() => setMusicBurst(false), 420);
                  handleSelectMode('music');
                }}
                className="relative z-10 group w-full px-2 pt-3 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#a855f7] bg-black/70 border border-[#a855f7]/60 hover:bg-[#a855f7]/15 hover:border-[#a855f7] active:scale-95 transition-all"
                style={{
                  clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)",
                  textShadow: "0 0 6px #a855f7",
                  boxShadow: "0 0 10px rgba(168,85,247,0.35), inset 0 0 8px rgba(168,85,247,0.15)",
                }}
                title="Watch our original AI musical art gallery"
              >
                <img
                  src={mtvAiWebToolsLogo}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  className="pointer-events-none absolute top-0.5 left-1/2 -translate-x-1/2 w-3 h-3 opacity-80 select-none drop-shadow-[0_0_3px_rgba(168,85,247,0.6)]"
                />
                ♪ MUSIC_GALLERY.exe
              </button>
            </div>
          ) : (
            <>
              <iframe
                ref={iframeRef}
                src={videoSrc}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
                title={currentTitle}
                style={{ minHeight: '70px' }}
                onLoad={handleIframeLoad}
              />
              <button
                type="button"
                onClick={handleTogglePlay}
                className="absolute inset-0 bg-transparent"
                title={isPlaying ? "Pause" : "Play with sound"}
                aria-label={isPlaying ? "Pause pinned video" : "Play pinned video with sound"}
              />
              {/* MTV-style AIWebTools bug — only in music mode, bottom-left, non-interactive */}
              {isMusicMode && (
                <img
                  src={mtvAiWebToolsLogo}
                  alt="MTV AIWebTools.ai"
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-1.5 left-1.5 w-8 h-8 opacity-60 select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  draggable={false}
                />
              )}
            </>
          )}
        </div>

        {/* Controls bar - compact square buttons */}
        {mode !== 'idle' && (
        <div className="flex justify-center py-1 px-1.5 bg-gray-800/95 border-t border-cyan-500/20">
          <div className="grid grid-cols-3 gap-1 w-full">
            <button
              onClick={handleTogglePlay}
              className="h-7 w-full flex items-center justify-center rounded bg-green-500 hover:bg-green-400 text-black"
              title={isPlaying ? "Pause" : "Play with sound"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handlePrevVideo}
              className="h-7 w-full flex items-center justify-center rounded bg-gray-600 hover:bg-gray-500 text-white"
              title="Previous Video"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNextVideo}
              className="h-7 w-full flex items-center justify-center rounded bg-gray-600 hover:bg-gray-500 text-white"
              title="Next Video"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={toggleMute}
              className="h-7 w-full flex items-center justify-center rounded bg-cyan-500 hover:bg-cyan-400 text-white"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleToolClick}
              title={isMusicMode ? 'Browse all AI tool categories' : (currentTool ? `Open ${currentTool.title}` : 'Open tool')}
              className="col-span-2 h-7 w-full text-[12px] tracking-wider rounded bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 hover:from-amber-400 hover:via-yellow-200 hover:to-amber-400 text-black font-extrabold active:scale-95 bg-[length:200%_100%]"
              style={{
                boxShadow: '0 0 12px rgba(255, 215, 0, 0.8), 0 0 24px rgba(255, 215, 0, 0.5), 0 0 36px rgba(255, 215, 0, 0.3)'
              }}
            >
              {isMusicMode ? '▦ VIEW ALL TOOLS' : `▶ TRY ${currentTool ? 'THIS TOOL' : 'NOW'}`}
            </button>
          </div>
        </div>
        )}
        {mode !== 'idle' && (
          <button
            onClick={() => setMode('idle')}
            className="w-full text-[9px] uppercase tracking-wider py-0.5 bg-black/60 text-cyan-300 hover:text-white hover:bg-black/80 border-t border-cyan-500/20"
            title="Switch between Tools and Music Video gallery"
          >
            ⇄ Switch Mode
          </button>
        )}
      </div>
    </div>
  );

  // Render via portal to escape any parent stacking context (common cause of hidden UI with audible media)
  if (typeof document === 'undefined') return null;
  return createPortal(playerUi, document.body);
});

PinnedVideoPlayer.displayName = 'PinnedVideoPlayer';

export default PinnedVideoPlayer;