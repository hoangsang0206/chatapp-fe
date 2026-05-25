import { ChatThread, Story, Notification, UserProfile, FriendRequest, CalendarTodo } from './types';

export const INITIAL_PROFILE: UserProfile = {
  name: 'Bùi Hữu Vũ',
  bio: 'Sống trong lưới. Chết trong mã. Liên lạc bảo mật qua kênh Delta.',
  userId: 'UX_8829_ALPHA',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMM_9hCXx8LmVtQvXo2cCAySjAuFzAR6Apv0dQVRjaCrYqdhMiNmb8vnF5zUhkv_9IQlJotuScGYBar5Kx2cmwswIYtdVd6bxR5_1QnZSGHX-UtwLl3VqNjo8sGZEkFPjhQuSGeJmBm2D5K8CW4XW2Bq-W_vpDA84ZPCge2hEcGapD_wbpHEXcJxbrH0oQU-0qiYql8ptmylwnh3769LSt3iKYYEWZD0UHzT-PpfhRlkoQRBWY4Jj-6m2yS1cRf72ayZhv98UqfFM',
  banner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoZZgF4-VXO4aezTrdSAyWj-uGWTKAUK1ssf2Y2bZOyPH2QkLovryINv7EVXemK5PUioEI6OLR4Gi5cIMrd1dRTCZ21M0z9NZeXnBzUHY_rlkBZZckgyfeHqIIzxyag24lfY-x361pZ5NslPCkpvQvEd7B4JFeM6lOtZS-uwfs22-mwTgyx35f7LNNlFv0tHaJiZa8Nt0W_zeLhd8G4kQ3l4UDibmbQG5ZhPj3kvr8rr4jnEuwO8NyXTGMDtm-QoUtQV_LPMXw9fQo'
};

export const INITIAL_STORIES: Story[] = [
  {
    id: 's1',
    sender: 'Vicky',
    seed: 'Vicky',
    isMine: false,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcV0xhLekr-6wP7d21_4g3eQtx6RbN0fffOPyO8NuLSOfwXLgL2UTivvf52dD38zB1JeGgYGoLqu1x5GyaybjvfrUDwAurilmvDMKtL3GJNj8NiL7SpydOhmkcljrM3Xr7ea-RMELzckpvjZkBZ8tsfiDDY-Vx-m32cFvTLEM6nUw4_LhDLefv-DzaUhas8vA8lvZ8TH68SzQqVVAPFW4-VMMWkYctlIv5-rpmZVgqHk3yl1hom1O02_Z61NfgC7g0be9Xlj14I_8t'
  },
  {
    id: 's2',
    sender: 'Kyla',
    seed: 'Kyla',
    isMine: false,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJmJXRKb_eQkzcIAw2LbynC2pt-nZVA_n9m5AZV92Mb9vSCN1L1VEu1JLcCXqXTK0BCnFyG28qHDFOOHoVXJOvZnfl33hJJ3uNJeds7NdBghNYUhveC5RlFvluDfYyqleHG7keQ4labx0Nmm8aHRcRazgvK5_U8RQda4yO0AC22atIdmbfdcEFTnDRkHwRm5cpYzzuKLBCxMRC74vG7sTWo_Cq8J4f0V-p_nfB0XREJaSqF_Md5wEgqCEOw0kNyHIsIWqJc9b7jANz'
  },
  {
    id: 's3',
    sender: 'Zoey',
    seed: 'Zoey',
    isMine: false,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGFrXWCzagA4UmsH-f_EpDn1kdrzgu8_58cRjQzpH0n34r9Yi5S5J4889M15jqomAaeAMr1-Yh48gNU5nM9EE3cFlNXg5bRu5T1douJ1iXOG8xPQUlmWKKBd8WcXxUNVFaJxR807g0nHHp8-O4KNoF-w9z3Xsk_hUTW_wvnF2Zq6VUge7ltJVV1Wg_Sz7ZfFy2Tro2uqTvwQIEiN8f_9kZfwrDKAET5ZzINIT2xMb8xn4wdPM7Q5rT1xKjvtdTwgROoNP-6WIMTieF'
  },
  {
    id: 's4',
    sender: 'Leo',
    seed: 'Leo',
    isMine: false,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOvGYlXo_Q52_zWuI3nerk_F47q5HaW9hUBJ7EgUleGbAwC3Unio9PYKBDvawzWuoyfLYLncxeuhu5Hf15JH6p-rP7mHBwoDFPxYZAdv8YU5zYGhkt7B-8tUiSBEPmr5k24wdlWlYiPv5wl1DSrSP_S4jhff3eQHVjdvrIvNhz8GyuniOujhWI9dYEn0UNj8hw0HsO-RxDYyvKfJmuJ5fL-k3fYYetdxna2ilI-4V0EgXaqDehbSUlU5MIiyBNW_96RkIiQ9qCbsJ_'
  },
  {
    id: 's5',
    sender: 'Milo',
    seed: 'Milo',
    isMine: false,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDywhuySMj3oDCncyTohF8rUiGqVim17d2yJNuBDSgL6oVuOi1wgyDvxcqzUuHplQIPy6bFyK2Aq3vJWpFjAc6XTgvdGFivAcgkeJWxfrTwiffk9ozLo3ezfKKV07Jb1FgzJaBvv-6iqE3G_YgZyLzXG9iBOdI-1H_EkEsB11Ce5QgLEePUvZm55cDO9httzwcs3epJ_XdJs2fr10KF7YIKw8D46wzu4v4IVf1mC9IQ_8B7mupkwO_Tw6UcyV6B0ts3Z3qyhzLiq7BU'
  },
  {
    id: 's6',
    sender: 'Nala',
    seed: 'Nala',
    isMine: false,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWHUCKwt2hUlncuDJRf73HbPb7TNi9YyMFwy7eQRWNghup1ure0EQ7GUAMPrQQlTeVrrz-dxjjwUb7n4xOKm5HcbgWcTsb65gnZbXtsbR_yjoLBQk375ArRsAB_jgR5WXmRxfqMZXpc0_wWHIwqpdsJe01fDJ4cVtQGFVygj3yFVmA_vIIoahS3wJYKoCoi5w0uoS8KpjYtxA8CFAlaVBM9E-OhecLcL_SB8fOcAL67GLce3Y6g2G1pyh9-APr6MF_-xnoFOTBp2MI'
  },
  {
    id: 's7',
    sender: 'Zero',
    seed: 'Zero',
    isMine: false,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzqt_fc7_LLYB-FqJQ9_CQdTyriJrdgiI4LzIzV82Nhc1X_DHrnUfumP_HNKfAsyrCzb2KGx_EOhu4zUrLzj3oJ-jRYUPt9luZN_IZNER8bt_xTsaIdMTn4sBL9_lHxHtN-VuXZQcQjQ18iQMMF3OKnQvwReYM5k0PGW-22Bcm2_SJAiz0zHXsQyEioJJlm0wUAjRNQBrGhYkpqxv00mPDzFwqzq3jlymGm8mEOdv6QdxdfMAOCatS8WpZvwomMvczK_MYnyUpjUOT'
  },
  {
    id: 's8',
    sender: 'Ghost',
    seed: 'Ghost',
    isMine: false,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMHdxsCm4sCMDJYkc01WksFAYzxNqXEqlR1cCJB4-qA7nPCy8O1VPHt9KNQkJ3vdO3bUTPQYBhnXkstBSwYHtcVy77v9Dc1beiVMyF-uc-4kZ2NGoSvZBjLZc9DeYnyewh4mY9ulY8hHXpd2lrm6fn_JWJBIDcQEGjqbb9W0umqSQs-OLWNV3InUsLkDXneCoWsFUL7V2Y8uUnw5IYDAUObRuHb6j3qnLTSOTTXWqRGxtfpYdZdpQ3a3JqZa656uvd0-SaQttfg5_S'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    sender: 'LEO',
    text: 'Tối nay có đợt chạy mới tại khu vực trung tâm.',
    time: '2m ago',
    color: 'green'
  },
  {
    id: 'n2',
    sender: 'NALA',
    text: 'Cảnh báo hệ thống: Truy cập trái phép tại node 7',
    time: '15m ago',
    color: 'magenta'
  },
  {
    id: 'n3',
    sender: 'SYS_ENG',
    text: 'Cổng bảo mật 0x4B đã được mở thành công bởi Administrator.',
    time: '45m ago',
    color: 'cyan'
  }
];

export const INITIAL_CHATS: ChatThread[] = [
  {
    id: 't1',
    name: 'XENON_GIRL',
    type: 'direct',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCF6FSeNtVpByLVGV-8MkWt4GAjctSl2pkTRKRmygfhsk8ztLK_lRnE9bGT2gnW82R9elOri9_yn3-QZ_Si4yTfTO2M8uX7FKYYX7UHrpp5NvfeNQyRZcL_qh8yAXVCvn9_OIVh1EQUQXCYIPrqKF6DMzkEaUcsV4xsAZwaWJKqOgyDN7NqPKktq7aIrSLyIujG_-MGbcwdjCHdo36Ej1XpHPQUfJisF9xNV-_R3ezAJbih5i3q88D2GiDuPZYsDwKK4B4Ym-axO20',
    status: 'online',
    nodeValue: '0x2BD54B',
    unreadCount: 1,
    messages: [
      {
        id: 'm1_1',
        sender: 'XENON_GIRL',
        text: 'The data packet from the Arasaka subnet is ready for extraction. Are you prepared to tunnel through the mainframe?\n\nWarning: ICY detected in the third layer.',
        timestamp: '04:35',
        isMine: false,
        isRead: false
      },
      {
        id: 'm1_2',
        sender: 'Bùi Hữu Vũ',
        text: "Tunneling protocol engaged. I've bypassed the first firewall.\n\nSend the decryption keys now. We only have a 30-second window.",
        timestamp: '04:36',
        isMine: true,
        isRead: true
      }
    ]
  },
  {
    id: 't2',
    name: 'Agent_K',
    type: 'direct',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_j7BVdsDqKKDCPFVZ2Gn9UPrHK0YE5hnWALyfRcGSqLzWsd7J4NcahoDs56OIghwrjOiTLiI1XRMCR7Zgvp07wz2plsiuq_nnkEO_Ojy6LUXJ6jJMeRSgPvFY0KDs0g1UgcBoLLdyKK1zhS4hu-LB-LyQz-Zj4CNQDHIUwbt57mbIAubHWxM_4lnKaQOZNB457Up7ZVE3y1PfhVXTE5_zzKKTKN3oGNHDEnW9xvInnGESXuUrDdsEj76KoHidaLBIJidFvtPggLfR',
    status: 'online',
    nodeValue: '0x1F2A8E',
    unreadCount: 0,
    messages: [
      {
        id: 'm2_1',
        sender: 'Agent_K',
        text: 'Are you there? We need your support to secure node 4.',
        timestamp: '02:12',
        isMine: false,
        isRead: true
      },
      {
        id: 'm2_2',
        sender: 'Bùi Hữu Vũ',
        text: 'On my way. Activating submask routing proxy now.',
        timestamp: '02:15',
        isMine: true,
        isRead: true
      }
    ]
  },
  {
    id: 't3',
    name: 'Void_Runner',
    type: 'direct',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtSB7uGFSwgYbCvatY04d8zbPU51yxmR95fChsSV4rnj2V7d0s2RmXHn6GQOPP07EFH1AEKb5r-SJMnaShymMMmDel8P_24A6l0c8-IPmvPeRBZ8Bq6EFHjSYIBEXR1dte6sYimc-OYpipUDHLnCBXDU_yjXbdP-WQ360EEIKg9hPXXhpmXkG40-5WBj-0qrA10v6ouMttfGHF_w9Z9SpJJLL1Pax0tbmMZSFDuITvCWEQnIRsJJHWp38rqommHuK5fT_pYhSzw8g',
    status: 'away',
    nodeValue: '0xD19DAF',
    unreadCount: 0,
    messages: [
      {
        id: 'm3_1',
        sender: 'Void_Runner',
        text: 'Ping me when the bridge is open.',
        timestamp: 'Yesterday',
        isMine: false,
        isRead: true
      }
    ]
  },
  {
    id: 't4',
    name: 'Synth_Wave',
    type: 'direct',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5r9dhTc4fxJ3tXxYQ6vFPXuo0PGa5zK7zkvExEeJ0Kj4CYYaYffAq717ZNWbqdHOxkvKKhaHafg_otobHE1i-lWAHxUlz17hGpmS3ZZH-qg-fjGDzFO0RIEDgq8MKHs0WNku-ILMdxFR0n1OtaLezgA3UNqulNK_Z5FSzgYH7W-ZA1v0fbDG1T93DHSdUT2ze2x3axa1-1dXM5WvpJBv-LYn38rTfcKcJN68b2TUDWFWv-FwjycWkcmeVdbtysaRA2USf_U8ZKm0',
    status: 'online',
    nodeValue: '0x61CEC0',
    unreadCount: 0,
    messages: [
      {
        id: 'm4_1',
        sender: 'Synth_Wave',
        text: 'The firewall is cracking. 10 mins.',
        timestamp: 'Yesterday',
        isMine: false,
        isRead: true
      }
    ]
  },
  {
    id: 't5',
    name: 'LEO',
    type: 'direct',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOvGYlXo_Q52_zWuI3nerk_F47q5HaW9hUBJ7EgUleGbAwC3Unio9PYKBDvawzWuoyfLYLncxeuhu5Hf15JH6p-rP7mHBwoDFPxYZAdv8YU5zYGhkt7B-8tUiSBEPmr5k24wdlWlYiPv5wl1DSrSP_S4jhff3eQHVjdvrIvNhz8GyuniOujhWI9dYEn0UNj8hw0HsO-RxDYyvKfJmuJ5fL-k3fYYetdxna2ilI-4V0EgXaqDehbSUlU5MIiyBNW_96RkIiQ9qCbsJ_',
    status: 'online',
    nodeValue: '0x96B063',
    unreadCount: 0,
    messages: [
      {
        id: 'm5_1',
        sender: 'LEO',
        text: 'Tối nay có đợt chạy mới tại khu vực trung tâm.',
        timestamp: '14:20',
        isMine: false,
        isRead: true
      }
    ]
  },
  {
    id: 't6',
    name: 'NALA',
    type: 'direct',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWHUCKwt2hUlncuDJRf73HbPb7TNi9YyMFwy7eQRWNghup1ure0EQ7GUAMPrQQlTeVrrz-dxjjwUb7n4xOKm5HcbgWcTsb65gnZbXtsbR_yjoLBQk375ArRsAB_jgR5WXmRxfqMZXpc0_wWHIwqpdsJe01fDJ4cVtQGFVygj3yFVmA_vIIoahS3wJYKoCoi5w0uoS8KpjYtxA8CFAlaVBM9E-OhecLcL_SB8fOcAL67GLce3Y6g2G1pyh9-APr6MF_-xnoFOTBp2MI',
    status: 'busy',
    nodeValue: '0x2B0CEA',
    unreadCount: 0,
    messages: [
      {
        id: 'm6_1',
        sender: 'NALA',
        text: 'Xác nhận ID người dùng: #8829-X',
        timestamp: '13:55',
        isMine: false,
        isRead: true
      }
    ]
  },
  // Group Chats
  {
    id: 'g1',
    name: '#NEON_CITY_RUNNERS',
    type: 'group',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=g1',
    unreadCount: 24,
    nodeValue: '0x404',
    messages: [
      {
        id: 'mg1_1',
        sender: 'ZeroCool',
        text: 'Anyone active around Sector 7? Cops spotted near the tech center.',
        timestamp: 'Yesterday',
        isMine: false
      }
    ]
  },
  {
    id: 'g2',
    name: '#ENCRYPTED_VOX',
    type: 'group',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=g2',
    unreadCount: 0,
    nodeValue: '#ENC',
    messages: [
      {
        id: 'mg2_1',
        sender: 'CipherMaster',
        text: 'Secure channel initialized successfully.',
        timestamp: '3 days ago',
        isMine: false
      }
    ]
  },
  {
    id: 'g3',
    name: '#BLACK_MARKET_DASH',
    type: 'group',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=g3',
    unreadCount: 1,
    nodeValue: '#RAW',
    messages: [
      {
        id: 'mg3_1',
        sender: 'SYSTEM',
        text: '>> System alert: New trade nodes detected in sector 7...',
        timestamp: '10 mins ago',
        isMine: false
      }
    ]
  }
];

export const INITIAL_FRIEND_REQUESTS: FriendRequest[] = [
  {
    id: 'fr1',
    name: 'PROXY_M4STER',
    subText: 'Level 4 Node Access',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYeORsi-9iFh6oi2SFF8DTm3CJmO8gZZFrFnJlmva8am-3gvWTMZMvie2FazDa1sUu3el2COJC3a4hECiONOEr_enItPV1uCukjukDYqLQr28V5y4MYFDP-Mq1ZQrHDrxXtrgxNZeSJ7L635Nm6WT4zfElDnm1r_2jwfYsaCDWA4KgwWtaIUJ-vzlu_t05C7vGYlq_bVDlR_M799kR93JWQyJterX9WcyXF9dZLT9KLwrMP2jiZJQmwkmaFg4HV0GqjPOCC1IzwoA'
  },
  {
    id: 'fr2',
    name: 'GHOST_EYE',
    subText: 'Encrypted Ping',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_bfTYY7FlzTR6TX7YXIBS051w0FdkSFkBMOwFvgPi70rYSYpWKvoGmZkmNITIFm_90xBH4PWzpafBwoAx0KYEu6b3OFtdbekV7TDPM5dzmQYPbiNqKvTbif40Qit8fpdYdqzAhorbYWl13F69QA6OO12HJg8rNrKrFsvytRGCd37u6GOVSo4YQVbNlM9_ROZa3NavV_YuXRu7SwuDwUHR4OyQfuxXfxTHfpeWKXf8oOs7OSSYt3hr-tZyCCpWpIfH6LLHxPn78UM'
  }
];

export const INITIAL_CONTACTS = [
  {
    id: 'c1',
    name: 'ZERO_COOL',
    status: 'Scanning...',
    online: true,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAI8oYsHlEJVlNd0JPmkanne2ENjxWNHqeF8XRBEorrUbqG2rzZzFxClg772yjh0I2H2psJ_E3N2YzDZrteMEbzw0CqvZPqhRmA7kDysUhzzRQujYPdDSEkwW6dME4db4TafGuDlB4U262UdYVsnoApRayASPbhzUzYmyuaJRZtIWejghwYOz1x_Af9tT8wYAvAEIrlrUYWf1neUyTNTPXoi7_eUx5GXCjyOzjJ6DPouqV0CP5Gn42NHyk-XU1ekMlZGoh-vzQo_1E'
  },
  {
    id: 'c2',
    name: 'CRASH_OVERRIDE',
    status: 'Idle // Secure Server',
    online: true,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIGcMjlJVWJfzhNFiNG33lewd8C01uV8UCq1kKf9RVD46_ojbbTwzY0_Uv9Mj9EyjaZnqsAvz-i4JDwK3fTaeeqMj9pt7nJUrVw2ugpXdQyzFKpROuzKIXrjzlEZVGs1nd4rZxNx8vmW-Ht7Mx67TYD_aO3zH6FeJU0I9soC47Bua7VmyWJee_eZfa4niQ0ynh1yyAEA_AbIv-8Nq82oTbDwbpSGGyqJpLGqdM9XkkRSzVm-YFl0-pWQewo6k8DExXPZG5C3BrHzo'
  },
  {
    id: 'c3',
    name: 'ACID_BURN',
    status: 'Offline // 4h ago',
    online: false,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSta69hUqiI_HfA1YHvnkyRjlKzhgjuGpJYfNV4BY6xUMnQ6XtTguV_E-cqlrtAXqRk0NbQfX1bnT0sYTITLzpd3zbfKkihMW79jEmgtgFi3xy1HqxhKNoqjJod810LFOMs_ZD-FXbUJSluwzKy-y92vxGaoqICUKXiZ62m_sKS8lrHkdG7l_ajZdu5youfJx2pA_I1PBeksEj0tQNxoTYxDcq1vs110wCkOaTwoAQDOU6ma_hxblFL0vj3yABSuILetyAVsHUJNw'
  },
  {
    id: 'c4',
    name: 'LORD_NIKON',
    status: 'Online // Cryptic Hub',
    online: true,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhxh_JALFVHGhYwXr_nlv1d0FXT8EWqab8vdk4I1CowuvBEU0iStoebQLaRyr0LblXjlkbolX1VJ3l7O0z72cy2CT0JQ8wMYXs8mekJ0DVyAwavbPkXqeAQuqdjH7am_I7Vkeuli2LVCV3IpcG6kQ6Evoo18bD8890yDafHIE475zUUmdXZYDq3tmDwLmUxuDTC4wxXZEwWQf7ZEXTlIGLcFLjJIIjoLomHzmT8Cmgbw2riPH947CqVylveMpwzuviId9H2aLOQz8'
  },
  {
    id: 'c5',
    name: 'VOID_WALKER',
    status: 'Busy // SecNet',
    online: true,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtGbQKRQQSJbP6uKq404YRFYDf2CmoE1V-OhyLQ4qI3Sa1gVEN7tfbkaU1rLHEluwHQ47Lls13R4cCMMvYxD4w8QyxAkCpZlH6gDPzdNc9ebDxOiIOXyLbqnncbx4NI8YURlDsUCRGgLqm9fhSZHs2SJqaGN7UD-fB0RJbDokHffGArhd38csh0PWUHi64vnkCuzF0P0IpUtm8sTfIFUGt_magJeeS9RDS7xmOuaJpbWwdnis_2tbTKtatp4wzLG8lA0ejrEVEgiP8'
  },
  {
    id: 'c6',
    name: 'X-STATIC',
    status: 'Online // Low Signal',
    online: true,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBembgBvAm28Q3TF6yLwjxsjLlYavp3GCWBc2NRr8nJ-op1iSlMxMIRH6paC_LlnLpFExNVFTxTSzcXekvj_A1WxV_npzwUvvLrOLfIeXRwyEG4KVLGpsAZI71Y_WCg9dlXeyd1zV2DaRFBirvWJjnnOa-bzV_bbpgoFvd5bmbYsx2SLlGQ2Xa5Vp7_sTdjNJsypTzWrAidwrS1NupZWkqb6eoZmGwokwqKY48BHCvbaTrd5x7PghBEf1yvkE5MUGUquC2tF37e3gF0'
  }
];

export const INITIAL_TODOS: CalendarTodo[] = [
  {
    id: 'todo-1',
    title: 'Họp tối ưu bảo mật Node Delta',
    completed: false,
    dateStr: '2026-05-25',
    priority: 'high',
    time: '14:00',
    description: 'Báo cáo chi tiết lỗ hổng zero-day lớp thứ 3 đã được phát hiện.'
  },
  {
    id: 'todo-2',
    title: 'Review tài liệu API mới',
    completed: false,
    dateStr: '2026-05-25',
    priority: 'medium',
    time: '18:30',
    description: 'Xét duyệt tài liệu kết nối bảo mật cổng 0x4B.'
  },
  {
    id: 'todo-3',
    title: 'Kiểm tra tường lửa máy chủ',
    completed: true,
    dateStr: '2026-05-25',
    priority: 'high',
    time: '08:00',
    description: 'Chạy thử kịch bản khai thác mô phỏng.'
  },
  {
    id: 'todo-4',
    title: 'Bàn giao mã nguồn bản Alpha',
    completed: false,
    dateStr: '2026-05-26',
    priority: 'high',
    time: '09:00',
    description: 'Gửi code hoàn thiện của mô-đun Story Media lên hệ thống.'
  },
  {
    id: 'todo-5',
    title: 'Thử nghiệm quét virus tự động',
    completed: false,
    dateStr: '2026-05-26',
    priority: 'low',
    time: '16:00',
    description: 'Đánh giá khả năng dọn dẹp các tiến trình lạ.'
  },
  {
    id: 'todo-6',
    title: 'Bảo trì máy chủ cơ sở dữ liệu',
    completed: false,
    dateStr: '2026-05-28',
    priority: 'medium',
    time: '23:00',
    description: 'Khởi động lại node backup và đồng bộ hóa nhật ký giao dịch.'
  },
  {
    id: 'todo-7',
    title: 'Tổng kết hiệu quả bảo mật',
    completed: false,
    dateStr: '2026-05-30',
    priority: 'low',
    description: 'Lập báo cáo tổng quan hằng tháng gửi hội đồng quản lý.'
  }
];

