// Equity Guardians preferred attorney network.
// Each state entry lists the featured, preferred attorneys for that jurisdiction.
// Selections are subject to change as the network evolves.

export interface Attorney {
  name: string;
  firm: string;
  website?: string;
  bio?: string;
}

export interface StateGroup {
  state: string;
  attorneys: Attorney[];
  note?: string;
}

export const attorneyNetwork: StateGroup[] = [
  {
    state: 'Alabama',
    attorneys: [
      {
        name: 'N. Christian Glenos',
        firm: 'Bradley Arant Boult Cummings LLP',
        website: 'https://www.bradley.com',
      },
      {
        name: 'Clark R. Hammond',
        firm: 'Wallace, Jordan, Ratliff & Brandt, L.L.C.',
        website: 'http://www.wallacejordan.com',
      },
    ],
  },
  {
    state: 'Alaska',
    attorneys: [
      {
        name: 'James J. Davis, Jr.',
        firm: 'Northern Justice Project, LLC',
        website: 'http://www.njp-law.com',
      },
      {
        name: 'Mark P. Melchert',
        firm: 'Jermain Dunnagan & Owens P.C.',
        website: 'https://www.jdolaw.com',
      },
    ],
  },
  {
    state: 'Arizona',
    attorneys: [
      {
        name: 'Todd Adkins',
        firm: 'Himmelstein & Adkins LLC',
        website: 'https://h-a.law',
      },
      {
        name: 'Steven N. Berger',
        firm: 'Engelman Berger PC',
        website: 'https://www.eblawyers.com',
      },
    ],
  },
  {
    state: 'Arkansas',
    attorneys: [
      {
        name: 'Adrienne L. Baker',
        firm: 'Wright, Lindsey & Jennings LLP',
        website: 'https://www.wlj.com',
      },
      {
        name: 'J. R. "Dick" Buzbee',
        firm: 'Solo practice, Little Rock',
        website: 'http://www.lawyers.com/Arkansas/Little-Rock/J-R-Buzbee-44562562-a.html',
      },
    ],
  },
  {
    state: 'California',
    attorneys: [
      {
        name: 'Sanaz Sarah Bereliani',
        firm: 'Bereliani Law Firm',
        website: 'https://www.berelianilaw.com',
      },
      {
        name: 'James Bates',
        firm: 'Law Offices of James W. Bates',
        website: 'https://www.jbateslaw.com',
      },
    ],
  },
  {
    state: 'Colorado',
    attorneys: [
      {
        name: 'Robert W. Hatch, II',
        firm: 'Hatch Ray Olsen Conant LLC',
        website: 'http://www.hatchlawyers.com',
      },
      {
        name: 'Chad S. Caby',
        firm: 'Womble Bond Dickinson (US) LLP',
        website: 'http://www.womblebonddickinson.com/us',
      },
    ],
  },
  {
    state: 'Connecticut',
    attorneys: [
      {
        name: 'C. Donald Neville',
        firm: 'Neville Law Firm',
        website: 'https://www.nevillelawfirm.com',
      },
      {
        name: 'Myles H. Alderman, Jr.',
        firm: 'Alderman & Alderman, LLC',
        website: 'http://www.alderman.com',
      },
    ],
  },
  {
    state: 'Delaware',
    attorneys: [
      {
        name: 'Erin K. Brignola',
        firm: 'Gellert Seitz Busenkell & Brown',
        website: 'https://www.gsbblaw.com/erinkbrignola',
      },
      {
        name: 'Stacey Weisblatt, Esq.',
        firm: 'Stern & Eisenberg',
        website: 'https://sterneisenberg.com/',
      },
    ],
  },
  {
    state: 'Florida',
    attorneys: [
      {
        name: 'Daniel M. Coyle',
        firm: 'Sequor Law',
        website: 'https://www.sequorlaw.com',
      },
      {
        name: 'Brett Lieberman',
        firm: 'Edelboim Lieberman PLLC',
        website: 'http://www.elrolaw.com',
      },
    ],
  },
  {
    state: 'Georgia',
    attorneys: [
      {
        name: 'Jason A. LoMonaco',
        firm: 'NowackHoward, LLC',
        website: 'https://www.nowackhoward.com',
      },
      {
        name: 'Kevin Stine',
        firm: 'Baker Donelson',
        website: 'https://www.bakerdonelson.com',
      },
    ],
  },
  {
    state: 'Hawaii',
    attorneys: [
      {
        name: 'Johnathan C. Bolton',
        firm: 'Goodsill Anderson Quinn & Stifel',
        website: 'https://www.goodsill.com',
      },
      {
        name: 'Matthew Evans',
        firm: 'Damon Key Leong Kupchak Hastert',
        website: 'http://www.hawaiilawyer.com',
      },
    ],
  },
  {
    state: 'Idaho',
    attorneys: [
      {
        name: 'Kim Reeves',
        firm: 'Hopkins Roden',
        website: 'https://www.hopkinsroden.com/foreclosure-defense-legal-services',
      },
      {
        name: 'Arnold L. Wagner',
        firm: 'McConnell Wagner Sykes + Stacey PLLC',
        website: 'https://www.mwsslawyers.com/',
      },
    ],
  },
  {
    state: 'Illinois',
    attorneys: [
      {
        name: 'Jonathan E. Aberman',
        firm: 'Troutman Pepper Locke LLP',
        website: 'https://www.troutman.com',
      },
      {
        name: 'Erica Nancy Byrd',
        firm: 'Valentine Austriaco & Bueschel, P.C.',
        website: 'https://www.vablawfirm.com',
      },
    ],
  },
  {
    state: 'Indiana',
    attorneys: [
      {
        name: 'Reynold T. Berry',
        firm: 'Rubin & Levin, P.C.',
        website: 'https://www.rubin-levin.com',
      },
      {
        name: 'Wendy D. Brewer',
        firm: 'In-house counsel, Old National Bancorp',
      },
    ],
  },
  {
    state: 'Iowa',
    attorneys: [
      {
        name: 'Jeffrey W. Courter',
        firm: 'Nyemaster Goode, P.C.',
        website: 'https://www.nyemaster.com',
      },
      {
        name: 'Steven H. Krohn',
        firm: 'Evans & Dixon, L.L.C.',
        website: 'https://www.evans-dixon.com',
      },
    ],
  },
  {
    state: 'Kansas',
    attorneys: [
      {
        name: 'Dana Milby',
        firm: 'Milby Law Offices, P.A.',
        website: 'https://www.milbylaw.com',
      },
      {
        name: 'Julie Anderson',
        firm: 'The Law Offices of Anderson & Associates',
        website: 'http://www.mokslaw.com',
      },
    ],
  },
  {
    state: 'Kentucky',
    attorneys: [
      {
        name: 'Laura B. Grubbs',
        firm: 'Stoll Keenon Ogden PLLC',
        website: 'https://www.skofirm.com',
      },
      {
        name: 'Charles J. Otten',
        firm: 'Morgan Pottinger McGarvey',
        website: 'http://www.mpmfirm.com',
      },
    ],
  },
  {
    state: 'Louisiana',
    attorneys: [
      {
        name: 'Laura F. Ashley',
        firm: 'Krebs Farley',
        website: 'http://www.krebsfarley.com',
      },
      {
        name: 'Brian M. Ballay',
        firm: 'Baker Donelson',
        website: 'https://www.bakerdonelson.com',
      },
    ],
  },
  {
    state: 'Maine',
    attorneys: [
      {
        name: 'Randy J. Creswell',
        firm: 'Creswell Law',
        website: 'http://www.creswelllaw.com',
      },
      {
        name: 'Sonia J. Buck',
        firm: 'Pierce Atwood LLP',
        website: 'https://www.pierceatwood.com',
      },
    ],
  },
  {
    state: 'Maryland',
    attorneys: [
      {
        name: 'Laura S. Bouyea',
        firm: 'Venable LLP',
        website: 'https://www.venable.com',
      },
      {
        name: 'Richard L. Costella',
        firm: 'Tydings & Rosenberg LLP',
        website: 'https://www.tydings.com',
      },
    ],
  },
  {
    state: 'Massachusetts',
    attorneys: [
      {
        name: 'Patricia Antonelli',
        firm: 'Demerle & Associates, P.C.',
        website: 'https://demerlepc.com',
      },
      {
        name: 'Lewis Jason Cohn',
        firm: 'Cohn & Dussi LLC',
        website: 'http://www.cohnanddussi.com',
      },
    ],
  },
  {
    state: 'Michigan',
    attorneys: [
      {
        name: 'Michelle H. Bass',
        firm: 'Wolfson Bolton Kochis PLLC',
        website: 'https://www.wolfsonbolton.com',
      },
      {
        name: 'John W. Butler',
        firm: 'Butler Rowse Oberle PLLC',
        website: 'http://www.brolawpllc.com',
      },
    ],
  },
  {
    state: 'Minnesota',
    attorneys: [
      {
        name: 'Thomas P. Carlson',
        firm: 'Carlson & Associates Ltd.',
        website: 'http://www.carlsonassoc.com',
      },
      {
        name: 'Jeffrey D. Klobucar',
        firm: 'Bassford Remele, P.A.',
        website: 'https://www.bassford.com',
      },
    ],
  },
  {
    state: 'Mississippi',
    attorneys: [
      {
        name: 'Jeffrey R. Barber',
        firm: 'Jones Walker LLP',
        website: 'https://www.joneswalker.com',
      },
      {
        name: 'Chad J. Hammons',
        firm: 'Jones Walker LLP',
        website: 'https://www.joneswalker.com',
      },
    ],
  },
  {
    state: 'Missouri',
    attorneys: [
      {
        name: 'Wendi S. Alper-Pressman',
        firm: 'Armstrong Teasdale LLP',
        website: 'https://www.armstrongteasdale.com',
      },
      {
        name: 'Cheryl A. Kelly',
        firm: 'Thompson Coburn LLP',
        website: 'https://www.thompsoncoburn.com',
      },
    ],
  },
  {
    state: 'Montana',
    attorneys: [
      {
        name: 'Shane P. Coleman',
        firm: 'Billstein, Monson & Small',
        website: 'https://www.bmslawmt.com',
      },
    ],
  },
  {
    state: 'Nebraska',
    attorneys: [
      {
        name: 'Thomas O. Ashby',
        firm: 'Baird Holm LLP',
        website: 'https://www.bairdholm.com',
      },
      {
        name: 'Lauren R. Goodman',
        firm: 'McGrath North Mullin & Kratz, PC, LLO',
        website: 'https://www.mcgrathnorth.com',
      },
    ],
  },
  {
    state: 'Nevada',
    attorneys: [
      {
        name: 'Bob L. Olson',
        firm: 'Snell & Wilmer L.L.P.',
        website: 'https://www.swlaw.com',
      },
      {
        name: 'Cam-Tu Dang',
        firm: 'Peters & Associates, LLP',
        website: 'https://www.pandalawfirm.com',
      },
    ],
  },
  {
    state: 'New Hampshire',
    attorneys: [
      {
        name: 'Joshua A. Burnett',
        firm: 'Amann Burnett, PLLC',
        website: 'https://www.amburlaw.com',
      },
    ],
  },
  {
    state: 'New Jersey',
    attorneys: [
      {
        name: 'Jennifer L. Alexander',
        firm: 'Griffin Alexander, P.C.',
        website: 'http://www.lawgapc.com',
      },
      {
        name: 'Stuart G. Brecher',
        firm: 'Law Offices of Stuart G. Brecher, LLC',
        website: 'http://www.brecherlawnj.com',
      },
    ],
  },
  {
    state: 'New Mexico',
    attorneys: [
      {
        name: 'Spencer L. Edelman',
        firm: 'Modrall Sperling',
        website: 'https://www.modrall.com',
      },
      {
        name: 'William R. Keleher',
        firm: 'Smidt, Reist & Keleher, P.C.',
        website: 'https://www.srklawnm.com',
      },
    ],
  },
  {
    state: 'New York',
    attorneys: [
      {
        name: 'Ronald D. Weiss',
        firm: 'Ronald D. Weiss, P.C.',
        website: 'https://www.ny-bankruptcy.com/',
        bio: 'Ronald anchors a Long Island and NYC practice active since 1993, with a 25-person team handling foreclosure defense, bankruptcy, and appellate work including reversals at the Appellate Division, Second Department.',
      },
      {
        name: 'Raymond D. Radow',
        firm: 'The Radow Law Group, P.C.',
        website: 'https://www.radowlawgroup.com/',
        bio: 'Raymond represents homeowners across Nassau, Suffolk, Westchester, and the five boroughs, focusing on foreclosure defense, loan modifications, and short-sale matters with a personalized, homeowner-first approach.',
      },
    ],
  },
  {
    state: 'North Carolina',
    attorneys: [
      {
        name: 'Jeffrey Bunda',
        firm: 'Hutchens Law Firm LLP',
        website: 'https://www.hutchenslawfirm.com',
      },
      {
        name: 'William L. Esser, IV',
        firm: 'Parker Poe Adams & Bernstein LLP',
        website: 'https://www.parkerpoe.com',
      },
    ],
  },
  {
    state: 'North Dakota',
    attorneys: [
      {
        name: 'Kasey McNary',
        firm: 'Serkland Law Firm',
        website: 'https://www.serklandlaw.com',
      },
      {
        name: 'Caren Wanner Stanley',
        firm: 'Vogel Law Firm',
        website: 'https://www.vogellaw.com',
      },
    ],
  },
  {
    state: 'Ohio',
    attorneys: [
      {
        name: 'Laura M. Nesbitt',
        firm: 'The Nesbitt Law Firm',
        website: 'https://www.thenesbittlawfirm.com',
      },
      {
        name: 'Andrew Owen',
        firm: 'Calfee, Halter & Griswold LLP',
        website: 'https://www.calfee.com',
      },
    ],
  },
  {
    state: 'Oklahoma',
    attorneys: [
      {
        name: 'Larry G. Ball',
        firm: 'Hall Estill',
        website: 'https://www.hallestill.com',
      },
      {
        name: 'Gatlin C. Squires',
        firm: 'McAfee & Taft',
        website: 'https://www.mcafeetaft.com',
      },
    ],
  },
  {
    state: 'Oregon',
    attorneys: [
      {
        name: 'David DeBlasio',
        firm: 'Harrington, Anderson & DeBlasio',
        website: 'http://www.had-law.com',
      },
      {
        name: 'Michael Farrell',
        firm: 'Martin Bischoff, LLP',
        website: 'https://www.mblglaw.com',
      },
    ],
  },
  {
    state: 'Pennsylvania',
    attorneys: [
      {
        name: 'Phillip D. Berger',
        firm: 'Berger Law Group P.C.',
        website: 'https://www.bergerlawpc.com',
      },
      {
        name: 'John K. Fiorillo',
        firm: 'Unruh, Turner, Burke & Frees',
        website: 'https://www.utbf.com',
      },
    ],
  },
  {
    state: 'Rhode Island',
    attorneys: [
      {
        name: 'Joseph M. DiOrio',
        firm: "Pannone Lopes Devereaux & O'Gara LLC",
        website: 'https://www.pldolaw.com',
      },
      {
        name: 'Marc D. Wallick',
        firm: 'Wallick & Associates',
      },
    ],
  },
  {
    state: 'South Carolina',
    attorneys: [
      {
        name: 'B. Lindsay Crawford, III',
        firm: 'Crawford & Von Keller, LLC',
        website: 'https://www.crawfordvk.com',
      },
      {
        name: 'Jane H. Downey',
        firm: 'Baker Donelson',
        website: 'http://www.bakerdonelson.com',
      },
    ],
  },
  {
    state: 'South Dakota',
    attorneys: [
      {
        name: 'Paul Tschetter',
        firm: 'Boyce Law Firm, L.L.P.',
        website: 'https://www.boycelaw.com',
      },
    ],
  },
  {
    state: 'Tennessee',
    attorneys: [
      {
        name: 'Jason N. King',
        firm: 'Hudson, Reed, & Christiansen, PLLC',
        website: 'http://www.mborolaw.com',
      },
      {
        name: 'Ronald G. "Ronn" Steen, Jr.',
        firm: 'Thompson Burton PLLC',
        website: 'https://www.thompsonburton.com',
      },
    ],
  },
  {
    state: 'Texas',
    attorneys: [
      {
        name: 'John Helstowski',
        firm: 'J. Hels Law, PLLC',
        website: 'https://texascreditlaw.com/',
        bio: 'John leads our Texas real-estate practice with more than a decade of experience representing homeowners in foreclosure, deed-of-trust, and lender-liability litigation.',
      },
      {
        name: 'Richard Weaver',
        firm: 'The Weaver Law Firm',
        website: 'https://www.weaverlawyers.com/',
        bio: 'Richard leads a Houston and San Antonio real-estate practice with a litigation record spanning investigation through trial and post-judgment proceedings in real estate, business, and construction matters.',
      },
    ],
  },
  {
    state: 'Utah',
    attorneys: [
      {
        name: 'Wayne Z. Bennett',
        firm: 'Clyde Snow & Sessions, PC',
        website: 'http://www.clydesnow.com',
      },
      {
        name: 'Matthew M. Boley',
        firm: 'Cohne Kinghorn, P.C.',
        website: 'http://www.cohnekinghorn.com',
      },
    ],
  },
  {
    state: 'Vermont',
    attorneys: [
      {
        name: 'Alexandra E. Edelman',
        firm: 'Primmer Piper Eggleston & Cramer PC',
        website: 'https://www.primmer.com',
      },
      {
        name: 'Renee L. Mobbs',
        firm: 'Sheehey Furlong & Behm P.C.',
        website: 'https://www.sheeheyvt.com',
      },
    ],
  },
  {
    state: 'Virginia',
    attorneys: [
      {
        name: 'Ronald Page, Jr.',
        firm: 'Ronald Page, PLC',
        website: 'http://www.rpagelaw.com',
      },
      {
        name: 'Jennifer J. West',
        firm: 'Spotts Fain PC',
        website: 'https://www.spottsfain.com',
      },
    ],
  },
  {
    state: 'Washington',
    attorneys: [
      {
        name: 'Thomas S. Linde',
        firm: 'Schweet Linde & Rosenblum, PLLC',
        website: 'https://schweetlaw.com',
      },
      {
        name: 'Douglas R. Cameron',
        firm: 'Hanson Baker Ludlow Drumheller P.S.',
        website: 'http://www.hansonbaker.com',
      },
    ],
  },
  {
    state: 'West Virginia',
    attorneys: [
      {
        name: 'Steven Thomas',
        firm: 'Kay Casto & Chaney PLLC',
        website: 'https://www.kaycasto.com',
      },
      {
        name: 'Stephen L. Thompson',
        firm: 'Barth & Thompson',
        website: 'http://www.barth-thompson.com',
      },
    ],
  },
  {
    state: 'Wisconsin',
    attorneys: [
      {
        name: 'Mark A. Gauthier',
        firm: 'Miller & Miller Law, LLC',
        website: 'https://millermillerlaw.com',
      },
      {
        name: 'Frank W. DiCastri',
        firm: 'Reinhart Boerner Van Deuren s.c.',
        website: 'https://www.reinhartlaw.com',
      },
    ],
  },
  {
    state: 'Wyoming',
    attorneys: [
      {
        name: 'Stephen R. Winship',
        firm: 'Winship & Winship, PC',
        website: 'https://www.winshipandwinship.com',
      },
      {
        name: 'Timothy Woznick',
        firm: 'Crowley Fleck PLLP',
        website: 'https://www.crowleyfleck.com',
      },
    ],
  },
];
