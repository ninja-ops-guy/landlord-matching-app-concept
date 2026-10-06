export const initialLandlords = [
  {
    id: 1,
    name: "Arthur Pendelton",
    age: 58,
    avatar: "https://images.pexels.com/photos/7752822/pexels-photo-7752822.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    bio: "Retired civil engineer turned boutique brownstone owner. I fix clogs within 2 hours, bake sourdough for new tenants, and believe good communication is the foundation of civilization.",
    responseTime: "⚡ 3 mins average",
    style: "Hands-on DIY Legend",
    rating: "4.98",
    reviewsCount: 19,
    greenFlags: [
      "Owns every tool known to man",
      "Bakes fresh sourdough loaf on move-in day",
      "Radiator heat works like a charm",
      "Never raises rent for respectful tenants",
      "Leaves you completely alone unless asked"
    ],
    redFlags: [
      "Will talk for 20 mins about the copper plumbing history",
      "Strict no tap dancing rule on parquet floors"
    ]
  },
  {
    id: 2,
    name: "Cheryl Vance",
    age: 44,
    avatar: "https://images.pexels.com/photos/40035694/pexels-photo-40035694.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    bio: "Eco-architect & sustainable urban designer. My buildings feature rooftop solar, high-speed fiber internet, compost chutes, and zero VOC paints. Big dog lover!",
    responseTime: "⚡ Under 15 mins",
    style: "Eco-Conscious Progressive",
    rating: "4.95",
    reviewsCount: 14,
    greenFlags: [
      "1 Gigabit fiber wifi included in rent",
      "Free dog treats in the mail lobby",
      "Rooftop vegetable garden access",
      "Digital tenant portal with 1-click repairs",
      "Keyless smart locks everywhere"
    ],
    redFlags: [
      "Will judge you gently if you don't compost banana peels",
      "Building quiet hours enforced strictly at 11 PM"
    ]
  },
  {
    id: 3,
    name: "Marcus Sterling",
    age: 38,
    avatar: "https://images.pexels.com/photos/26150471/pexels-photo-26150471.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    bio: "Real estate founder and design fanatic. Focus on luxury, ultra-clean finishes, in-unit washer/dryers, and effortless paperless leases.",
    responseTime: "⚡ Instant (AI assistant + Marcus)",
    style: "Tech-Forward Luxury Concierge",
    rating: "4.91",
    reviewsCount: 22,
    greenFlags: [
      "In-unit Bosch washer/dryer in every apartment",
      "Gym with Peloton & sauna in building",
      "24/7 package locker so packages never get swiped",
      "Deposit held in high-yield interest escrow",
      "Same-day maintenance guarantee"
    ],
    redFlags: [
      "No incandescent bulbs allowed (LED only for the vibe)",
      "Move-in elevator must be booked 3 days ahead"
    ]
  },
  {
    id: 4,
    name: "Elena Rostova",
    age: 51,
    avatar: "https://images.pexels.com/photos/40035692/pexels-photo-40035692.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    bio: "Art gallery curator and historic preservationist. Love tenants who appreciate vintage molding, bay windows, and quiet reading evenings.",
    responseTime: "⚡ Same hour",
    style: "Warm Boutique Host",
    rating: "4.97",
    reviewsCount: 11,
    greenFlags: [
      "Welcome bottle of natural wine on kitchen counter",
      "Original 1920s hardwood restored to perfection",
      "Water pressure feels like a Scandinavian waterfall",
      "Permits house painting with approval"
    ],
    redFlags: [
      "No adhesive command strips that peel plaster",
      "Acoustic drum kits strictly forbidden"
    ]
  }
];

export const initialListings = [
  {
    id: 1,
    landlordId: 1,
    title: "Sunny Brooklyn Brownstone with Exposed Brick & Clawfoot Tub",
    neighborhood: "Park Slope, Brooklyn",
    city: "New York",
    rent: 3200,
    deposit: 3200,
    bedrooms: 1,
    bathrooms: "1.0",
    sqft: 850,
    images: [
      "https://images.pexels.com/photos/7587828/pexels-photo-7587828.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      "https://images.pexels.com/photos/7018253/pexels-photo-7018253.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      "https://images.pexels.com/photos/6585598/pexels-photo-6585598.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
    ],
    description: "Sun-drenched parlor floor apartment in a classic 1890s limestone brownstone. Features 11ft ceilings, decorative marble fireplace, oversized south-facing bay windows, deep clawfoot soaking tub, and butcher-block chef's kitchen.",
    amenities: ["Exposed Brick", "Clawfoot Tub", "Dishwasher", "Deco Fireplace", "South-facing Sunlight", "Garden Access", "Hardwood Floors"],
    petPolicy: "Cats & small quiet dogs welcome (with photo tribute)",
    utilities: ["Water & Heat Included", "Trash & Recycling Included"],
    leaseTerm: "12 Months (Renewable)",
    availableDate: "May 1st"
  },
  {
    id: 2,
    landlordId: 2,
    title: "Eco-Modern Loft with Floor-to-Ceiling Windows & Solar Power",
    neighborhood: "East Austin / Central",
    city: "Austin",
    rent: 2650,
    deposit: 2000,
    bedrooms: 2,
    bathrooms: "2.0",
    sqft: 1150,
    images: [
      "https://images.pexels.com/photos/6920439/pexels-photo-6920439.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      "https://images.pexels.com/photos/8092192/pexels-photo-8092192.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      "https://images.pexels.com/photos/7546648/pexels-photo-7546648.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
    ],
    description: "Architect-designed sustainable loft with open-concept floor plan, polished concrete floors, soaring 14-foot ceilings, and high-efficiency dual-zone heat pump A/C. Rooftop solar cuts electric bill by 60%.",
    amenities: ["1Gbps Fiber Internet", "EV Charging Station", "In-unit Washer/Dryer", "Balcony", "Polished Concrete", "Pet Washing Station"],
    petPolicy: "All dogs and cats welcome! Dog park 1 block away",
    utilities: ["Gigabit Fiber WiFi Included", "Trash & Water Included"],
    leaseTerm: "12 - 18 Months",
    availableDate: "Immediate"
  },
  {
    id: 3,
    landlordId: 3,
    title: "Highline Skyline Luxury Suite with Private Balcony & Smart Home",
    neighborhood: "Chelsea / Meatpacking",
    city: "New York",
    rent: 3950,
    deposit: 3950,
    bedrooms: 1,
    bathrooms: "1.0",
    sqft: 790,
    images: [
      "https://images.pexels.com/photos/8089172/pexels-photo-8089172.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      "https://images.pexels.com/photos/7167073/pexels-photo-7167073.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      "https://images.pexels.com/photos/7045907/pexels-photo-7045907.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
    ],
    description: "Ultra-modern corner residence perched over the Highline park. Floor-to-ceiling soundproof glass, automated blackout blinds, Miele appliances, spa bathroom with rain shower, and building amenities including 24h gym and doorman.",
    amenities: ["24h Doorman", "Peloton Fitness Center", "Automated Blinds", "Balcony with Sunset View", "Miele Appliances", "Package Cold Storage"],
    petPolicy: "Pets under 40 lbs permitted",
    utilities: ["Cold/Hot Water Included", "Gas Included"],
    leaseTerm: "12 Months",
    availableDate: "June 1st"
  },
  {
    id: 4,
    landlordId: 4,
    title: "Vintage Chicago Greystone Flat with Solarium & Restored Oak",
    neighborhood: "Lincoln Park",
    city: "Chicago",
    rent: 2450,
    deposit: 1500,
    bedrooms: 2,
    bathrooms: "1.0",
    sqft: 1080,
    images: [
      "https://images.pexels.com/photos/7173666/pexels-photo-7173666.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      "https://images.pexels.com/photos/6489117/pexels-photo-6489117.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      "https://images.pexels.com/photos/6238684/pexels-photo-6238684.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
    ],
    description: "Charming historic flat with preserved 1920s architectural millwork, restored pocket doors, sunny glass-enclosed solarium ideal for plants or remote work, and completely modernized bathroom with radiant heated floors.",
    amenities: ["Radiant Heated Floors", "Private Solarium/Sunroom", "Vintage Built-ins", "Dishwasher", "Basement Storage Locker", "Tree-lined Street"],
    petPolicy: "Cats welcome, small dogs case-by-case",
    utilities: ["Steam Radiator Heat Included", "Water Included"],
    leaseTerm: "12 Months",
    availableDate: "May 15th"
  },
  {
    id: 5,
    landlordId: 2,
    title: "Sunny Mission District Studio with Private Lemon Tree Patio",
    neighborhood: "Mission Dolores",
    city: "San Francisco",
    rent: 2850,
    deposit: 2850,
    bedrooms: 0,
    bathrooms: "1.0",
    sqft: 610,
    images: [
      "https://images.pexels.com/photos/4703/inside-apartment-design-home.jpg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      "https://images.pexels.com/photos/6657686/pexels-photo-6657686.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      "https://images.pexels.com/photos/6238684/pexels-photo-6238684.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
    ],
    description: "Quiet garden studio opening onto a private courtyard with an active Meyer lemon tree. Designer kitchenette with induction cooktop, built-in Murphy bed system with storage, and steps from Tartine Bakery.",
    amenities: ["Private Courtyard Patio", "Induction Cooktop", "Murphy Bed Built-in", "Bike Storage", "Dimmable Architectural Lighting"],
    petPolicy: "Well-behaved pets warmly welcomed",
    utilities: ["Water & Trash Included"],
    leaseTerm: "12 Months",
    availableDate: "Immediate"
  }
];

export const initialTenants = [
  {
    id: 1,
    name: "Elena Chen",
    age: 27,
    avatar: "https://images.pexels.com/photos/6497114/pexels-photo-6497114.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    job: "Senior Infrastructure Engineer",
    company: "Stripe",
    monthlyIncome: 16500,
    creditScore: 792,
    budget: 3600,
    city: "New York",
    bio: "I work 50 hours a week designing fault-tolerant systems, which means my apartment is my sacred sanctuary. I take shoes off at the door without being told, bake sourdough on Sundays, and have autopay wired on a cellular level.",
    petInfo: "Barnaby (Hypoallergenic Mini Goldendoodle, 18 lbs, crate trained, never barks)",
    petAvatar: "https://images.pexels.com/photos/10096129/pexels-photo-10096129.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    moveInDate: "May 1st",
    verifiedIncome: true,
    verifiedBackground: true,
    verifiedReferences: true,
    greenFlags: [
      "792 FICO Credit Score Royalty",
      "Autopay enabled since opening first bank account",
      "Previous landlord wrote: 'Wish she could stay forever'",
      "Never flushes wipes, cleans lint trap every load",
      "Income is 5.1x asking rent"
    ],
    redFlags: [
      "Will definitely ask to install a bidet attachment (will hire licensed plumber)",
      "Owns 14 monstera plants with terracotta saucers"
    ],
    rentalHistoryYears: 5,
    compatibilityScore: 98
  },
  {
    id: 2,
    name: "Dr. Liam O'Connor",
    age: 31,
    avatar: "https://images.pexels.com/photos/7752805/pexels-photo-7752805.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    job: "Orthopedic Surgery Fellow",
    company: "Mount Sinai Hospital",
    monthlyIncome: 14800,
    creditScore: 775,
    budget: 3400,
    city: "New York",
    bio: "Hospital resident who spends 75% of life in scrubs at the medical center. When home, I sleep with earplugs, brew Chemex coffee, and keep the apartment showroom immaculate.",
    petInfo: "No pets (too busy mending ACLs)",
    petAvatar: null,
    moveInDate: "Immediate",
    verifiedIncome: true,
    verifiedBackground: true,
    verifiedReferences: true,
    greenFlags: [
      "Rarely home to cause wear-and-tear",
      "Guaranteed hospital fellowship direct deposit",
      "Zero noise complaints in 8 years of renting",
      "Renter's insurance $300k bound and verified"
    ],
    redFlags: [
      "Sleeps random hours due to 24h trauma on-call shifts",
      "His espresso grinder sounds like a baby jet engine for 8 seconds"
    ],
    rentalHistoryYears: 6,
    compatibilityScore: 95
  },
  {
    id: 3,
    name: "Dr. Priya Patel",
    age: 34,
    avatar: "https://images.pexels.com/photos/37272329/pexels-photo-37272329.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    job: "Biotech Research Director",
    company: "Genentech / BioLabs",
    monthlyIncome: 19200,
    creditScore: 812,
    budget: 4000,
    city: "Austin",
    bio: "Molecular biologist with an obsession for order, Scandinavian mid-century furniture, and quiet tea ceremonies. Extremely respectful of historic architectural quirks.",
    petInfo: "None, just a curated bonsai collection",
    petAvatar: null,
    moveInDate: "June 1st",
    verifiedIncome: true,
    verifiedBackground: true,
    verifiedReferences: true,
    greenFlags: [
      "812 Pristine Unicorn Credit Score",
      "Income is 6.5x asking rent",
      "Treats hardwood floors like priceless museum artifacts",
      "Prepared to pay 1 full year rent upfront if landlord prefers"
    ],
    redFlags: [
      "Might test the tap water mineral balance with lab strips",
      "Requires quiet after 9:30 PM for sleep rhythm"
    ],
    rentalHistoryYears: 7,
    compatibilityScore: 99
  },
  {
    id: 4,
    name: "Samira & Dave",
    age: 30,
    avatar: "https://images.pexels.com/photos/40065289/pexels-photo-40065289.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    job: "Landscape Architect & Book Designer",
    company: "Studio Bloom & Self-Employed",
    monthlyIncome: 13500,
    creditScore: 760,
    budget: 3100,
    city: "Chicago",
    bio: "Couple of design nerds who view renting as taking stewardship of a historic home. We replace felt pads under all furniture legs and love sunny windows.",
    petInfo: "Waffles (Senior Golden Retriever, 10 yrs old, gentle couch potato)",
    petAvatar: "https://images.pexels.com/photos/9291110/pexels-photo-9291110.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    moveInDate: "May 15th",
    verifiedIncome: true,
    verifiedBackground: true,
    verifiedReferences: true,
    greenFlags: [
      "Felt pads installed under every single chair leg",
      "Handy duo: replaces washers and tightens hinges without calling",
      "Both work remotely in silence",
      "Senior dog is licensed, vaccinated, and sleeps 18 hours/day"
    ],
    redFlags: [
      "Will ask if they can prune the outdoor wisteria vine",
      "Owns 400 art monographs"
    ],
    rentalHistoryYears: 4,
    compatibilityScore: 93
  },
  {
    id: 5,
    name: "Julian Rivera",
    age: 26,
    avatar: "https://images.pexels.com/photos/5528969/pexels-photo-5528969.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    job: "Product Designer & Sound Engineer",
    company: "Figma",
    monthlyIncome: 11200,
    creditScore: 742,
    budget: 2800,
    city: "San Francisco",
    bio: "Interface designer at Figma. I appreciate minimalist spaces, high ceilings, and great lighting. Non-smoker, clean freak, cook mostly salads and sous-vide.",
    petInfo: "No pets",
    petAvatar: null,
    moveInDate: "Immediate",
    verifiedIncome: true,
    verifiedBackground: true,
    verifiedReferences: true,
    greenFlags: [
      "Sound engineer who only uses studio noise-canceling headphones",
      "High tech salary with stock grants",
      "Leaves place cleaner than check-in state",
      "Has electronic autopay ready"
    ],
    redFlags: [
      "Has a massive curved 49-inch ultrawide monitor",
      "Asks about electrical grounding for audio equipment"
    ],
    rentalHistoryYears: 3,
    compatibilityScore: 89
  }
];

export const initialMatches = [
  {
    id: 1,
    tenantId: 1, // Elena Chen
    listingId: 1, // Brooklyn Brownstone
    landlordId: 1, // Arthur Pendelton
    status: "tour_scheduled",
    tourDate: "This Saturday, May 3",
    tourTime: "11:30 AM",
    leaseMonthlyRent: 3200,
    leaseDeposit: 3200,
    leaseStartDate: "May 15th",
    leaseSignedAt: null
  },
  {
    id: 2,
    tenantId: 3, // Dr. Priya Patel
    listingId: 2, // Austin Loft
    landlordId: 2, // Cheryl Vance
    status: "lease_offered",
    tourDate: "Completed yesterday",
    tourTime: "Tour Verified",
    leaseMonthlyRent: 2650,
    leaseDeposit: 2000,
    leaseStartDate: "June 1st",
    leaseSignedAt: null
  }
];

export const initialMessages = [
  {
    matchId: 1,
    senderRole: "landlord",
    senderName: "Arthur Pendelton",
    text: "Hi Elena! Saw your 792 credit score and Barnaby's goldendoodle credentials. I love that you bake sourdough — I actually mill my own flour! The Brooklyn brownstone is looking great. Would love to invite you for an in-person tour.",
    messageType: "text",
    metadata: null
  },
  {
    matchId: 1,
    senderRole: "tenant",
    senderName: "Elena Chen",
    text: "Arthur! That's wonderful! Barnaby is thrilled too. The clawfoot tub and south-facing light look like an absolute dream.",
    messageType: "text",
    metadata: null
  },
  {
    matchId: 1,
    senderRole: "landlord",
    senderName: "Arthur Pendelton",
    text: "Official Tour Invitation: Saturday, May 3 at 11:30 AM. I'll have fresh warm sourdough and keys ready for you to walk through!",
    messageType: "tour_invite",
    metadata: {
      tourDate: "Saturday, May 3",
      tourTime: "11:30 AM",
      address: "142 Garfield Pl, Park Slope, Brooklyn"
    }
  },
  {
    matchId: 1,
    senderRole: "tenant",
    senderName: "Elena Chen",
    text: "Accepted! Looking forward to meeting you on Saturday. Thank you Arthur!",
    messageType: "tour_accepted",
    metadata: {
      tourDate: "Saturday, May 3",
      tourTime: "11:30 AM"
    }
  },
  {
    matchId: 2,
    senderRole: "landlord",
    senderName: "Cheryl Vance",
    text: "Hi Dr. Patel! It was so wonderful chatting after the virtual walk-through. Your background research and 812 credit score are legendary.",
    messageType: "text",
    metadata: null
  },
  {
    matchId: 2,
    senderRole: "landlord",
    senderName: "Cheryl Vance",
    text: "I've drafted the official 12-Month Lease Agreement for the Austin Eco-Loft. Rent is $2,650/mo including gigabit fiber and solar credits. You can review and digitally sign right here!",
    messageType: "lease_offer",
    metadata: {
      rent: 2650,
      deposit: 2000,
      leaseStartDate: "June 1st, 2025",
      leaseTerm: "12 Months",
      unit: "Apt 4B - Eco Loft",
      specialStipulations: "Gigabit fiber included, compost access, zero indoor smoking."
    }
  }
];
