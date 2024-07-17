import React, { Component, Fragment } from "react";
import { Row, Card, CardBody } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import PageHeader from "../common/PageHeader";
import { connect } from "react-redux";

class BestPractices extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.closeSidebar();
  }
  render() {
    return (
      <Fragment>
        <PageHeader
          heading={"Good Practices"}
          history={this.props.history}
          match={this.props.match}
          back_button={this.props.public ? true : false}
        ></PageHeader>
        <Row>
          <Colxx lg="12">
            <Card className="p-4 my-4">
              <p className="text-justify">
                To encompass a whole of government approach to streamlining the
                activities related to the Sustainable Development Goals (SDGs),
                the SDG Coordination Centre (SDGCC) has been set up in 2019 in
                the Planning & Coordination department in technical partnership
                with the United Nations Development Programme (UNDP). The State
                has a High-Level Steering Committee headed by the Chief
                Secretary for monitoring, policy review and course correction.
                The State also has a District SDG Cell headed by a Deputy
                Commissioner with all relevant Head of Offices in all districts
                for providing continuous guidance, overseeing implementation and
                monitoring for ensuring a coordinated action on SDGs. The State
                has engaged all Departments of the State Government in a
                dialogue on the SDGs through state and district level workshops
                and consultations and has formulated the Nagaland SDG Vision
                2030 Plan and indicator framework. The State has also developed
                various knowledge documents and publicity materials for
                localization of the SDGs across the State. The State is also
                developing an SDG dashboard as a single point source for State
                and district data for strengthening monitoring and evaluation of
                progress on SDG implementation through robust data collection
                and analysis. Going forward our focus will be on a)
                strengthening the institutional mechanism for SDG implementation
                at the State, District, Block, and Village levels b)
                mainstreaming the SDG indicators into all existing State
                Government schemes/Development programmes through Departmental
                action plans with baselines and targets c) continue the
                capacity-building and outreach at the District, Block and
                Village levels to increase the level of awareness regarding the
                SDGs, their effective implementation, data collation, bridge
                data gaps and monitoring to make the SDGs more locally relevant
                and action-oriented.{" "}
              </p>
              <p className="h5 text-justify font-weight-bold">
                Good Practice 1: ‘SDG Innovation Participatory Action Research
                Initiative’ of SDGCC, Planning & Coordination Department
              </p>
              <p className="text-justify">
                The ‘SDG Innovation Participatory Action Research Initiative’
                was initiated in the year 2021 by the SDGCC of the Planning &
                Coordination Department. It has been conceived with the idea of
                implementing innovative solutions to perennial problems in
                achieving the priority goals and indicators which are yet to
                progress in the State with the participation of the local
                population at the grassroots level. The initiative aspires to
                mobilise individuals, institutions and agencies to take action
                for the achievement of the priority goals and indicators whilst
                building coalitions across communities and societies. Under this
                programme, the most innovative solutions are given monetary
                assistance for implementation under the guidance and supervision
                of the SDGCC.
              </p>
              <p className="text-justify">
                Under this programme, the three most locally relevant and
                innovative solutions were selected from the communities and in
                the process of implementation, as follows:
              </p>
              <p className="text-justify pl-2">
                <div className="d-flex">
                  <div className="font-weight-bold mr-1">1. </div>
                  <div>
                    <b>
                      Project 'Pilot Operation of Waste to Protein Facility':
                    </b>
                    &nbsp; Under this pilot project, a breeding facility for
                    rearing the Black Soldier Fly (BSF) is set up at Bank
                    Colony, Dimapur, to test the Black Soldier Fly Larvae (BSFL)
                    process on various organic waste streams and thus determine
                    the feasibility of BSF farming in Nagaland as a means for
                    sustainable organic waste treatment i.e. waste reduction and
                    waste transformation into valuable products (animal feed
                    protein, and bio fertilizer). So far, 20 households are
                    involved in this initiative. This project is primarily
                    aligned with ‘SDG 11: Sustainable Cities and Communities’.
                  </div>
                </div>
                {/* <div className="d-flex justify-content-center mt-4">
                  <div>
                    <img src="/dashboard/assets/practices/1.1.jpg" alt="" />
                  </div>
                </div> */}
              </p>
              <p className="text-justify pl-2">
                <div className="d-flex">
                  <div className="font-weight-bold mr-1">2. </div>
                  <div>
                    <b>Project 'SusDesi':</b>
                    &nbsp; Under this project, a sustainable and integrated
                    waste management system in accordance with the existing
                    Waste Management Rules has been set up in the Lake View area
                    of Dimapur District. The project has sensitized the
                    community (398 households and 26 commercial establishments)
                    in the area on waste segregation and management. The project
                    has introduced door-to-door waste collection with a
                    systematic routine to dispose of waste directly from the
                    comfort of their residence and introduced vermicomposting
                    practices in the household. A material recovery facility for
                    recyclable and non-recyclable waste has also been set up in
                    the area. The project has also created employment as well as
                    income generation avenue for the unemployed youth in the
                    locality. This project is primarily aligned with ‘SDG 11:
                    Sustainable Cities and Communities’.
                  </div>
                </div>
                {/* <div className="d-flex justify-content-center mt-4">
                  <div>
                    <img src="/dashboard/assets/practices/1.2.jpg" alt="" />
                  </div>
                </div> */}
              </p>
              <p className="text-justify pl-2">
                <div className="d-flex">
                  <div className="font-weight-bold mr-1">3. </div>
                  <div>
                    <b>Project 'Inculcating Sustainable Consciousness':</b>
                    &nbsp; Multiple pilot interventions in the New Creation
                    School at Sekruzu of Phek District. It includes skill
                    development training of 250 students and 10 teachers for
                    manufacturing organic soap and bamboo-based utility items,
                    developing energy-efficient stoves, tutoring teachers on
                    modern methods of teaching and installation of solar panels
                    to harness solar energy for lighting the school hostel. This
                    project is primarily aligned with ‘SDG 4: Quality
                    Education’.
                  </div>
                </div>
                {/* <div className="d-flex justify-content-center mt-4">
                  <div>
                    <img src="/dashboard/assets/practices/1.3.jpg" alt="" />
                  </div>
                </div> */}
              </p>
              <p className="h5 text-justify font-weight-bold mt-4">
                Good Practice 2: ‘The Tizu Valley Biodiversity Conservation’ of
                Forest & Climate Change Department
              </p>
              <p className="text-justify">
                The Tizu Valley of Zunheboto district in Nagaland consists of
                six villages namely: Sukhai, Ghukhuyi, Nihoshe, Vishepu, Xuyivi
                and Kivikhu Villages. As per the customary rights of the state,
                the majority of natural habitats are owned and managed by
                individuals and clans overseen by village and district councils
                and other traditional institutions. These traditional
                conservation practices help protect biodiversity, through
                customary laws and other effective means. However, most of the
                economic activity in the villages is based upon the utilization
                of natural resources leading to the over-exploitation of forest
                resources.
              </p>

              <p className="text-justify">
                In December, 2016, three villages –Sukhai, Ghukhuyi and Kivikhu
                declared their Community Conservation Areas (CCAs) and agreed to
                form a joint CCA Management Committee resulting in the formation
                of an apex local body called – Tizu Valley Biodiversity
                Conservation and Livelihood Network (TVBCLN), for supporting
                biodiversity conservation through livelihood creation. These
                CCAs include forests, freshwater resources, grasslands as well
                as agriculturalforest complexes within their ambit. One of the
                major characteristics of these CCAs is that the communities are
                the decision-makers and have the capability to enforce rules and
                regulations.
              </p>
              {/* <p className="text-justify">
                <div className="d-flex justify-content-center">
                  <img src="/dashboard/assets/practices/2.1.jpg" alt="" />
                </div>
              </p> */}
              <p className="text-justify">
                With the intervention of the TVBCLN and the support of The
                Energy and Resources Institute (TERI), New Delhi, the following
                results were achieved:
              </p>
              <p className="text-justify pl-2">
                <div className="d-flex">
                  <div className="font-weight-bold mr-1">1. </div>
                  <div>
                    <b>Conservation education and sensitization:</b>
                    &nbsp; Community engagement through consultation,
                    conservation education, and public sensitization approaches
                    was used to increase awareness of threats and integrated
                    approaches at the community and stakeholder level. Thus
                    reaching out to a total of around 1,200 individuals
                    directly, along with a positive impact on more than 10,000
                    individuals indirectly living in the vicinity of the project
                    site.
                  </div>
                </div>
              </p>
              <p className="text-justify pl-2">
                <div className="d-flex">
                  <div className="font-weight-bold mr-1">2. </div>
                  <div>
                    <b>
                      Formation & formalization of joint Community-Conserved
                      Areas:
                    </b>
                    &nbsp; Due to the continuous and intense engagement with the
                    communities, the three villages formally declared around a
                    total of 939 hectares of biodiversity-rich forest as CCAs in
                    their respective villages, which are now being jointly
                    managed by them. However, apart from these CCAs, they have
                    also banned hunting and destructive fishing across the
                    entire landscape of their villages, covering 3,751 hectares
                    of forests and rivers. Also, a blanket ban on hunting wild
                    animals and birds, a ban on fishing by use of explosives,
                    chemicals, and generators, a strict prohibition of cutting
                    of fire-wood/felling of trees, as well as a ban on
                    collection of canes and other non-timber forest products,
                    have ensured the conservation of large contiguous forest
                    areas along with the unique endemic biodiversity they
                    support.
                  </div>
                </div>
              </p>
              <p className="text-justify pl-2">
                <div className="d-flex">
                  <div className="font-weight-bold mr-1">3. </div>
                  <div>
                    <b>
                      Biodiversity assessments and preparation of People’s
                      Biodiversity Registers (PBRs):
                    </b>
                    &nbsp; Regular biodiversity surveys in the designated CCAs
                    found an increase in the diversity of birds, reptiles,
                    butterflies and moths with the current checklist listing 222
                    species, 31 reptiles, 11 amphibians, 200 species of
                    butterflies and more than 200 species of moths. These have
                    been documented in the People’s Biodiversity Registers
                    (PBRs) with local and scientific names. These PBRs document
                    the folklore, traditional knowledge, ecology, biodiversity
                    and cultural practices of the locals and help codify the
                    oral knowledge of the communities. The sightings are also
                    uploaded on websites such as “eBird” and “Birds and
                    Butterflies of India”. These surveys, by documenting unique,
                    rare or special fauna, have also acted as a catalyst to
                    attract more outsiders to the area as ecotourists.
                  </div>
                </div>
              </p>
              <p className="text-justify pl-2">
                <div className="d-flex">
                  <div className="font-weight-bold mr-1">4. </div>
                  <div>
                    <b>
                      Alternative livelihood opportunities through ecotourism:
                    </b>
                    &nbsp; The training of youth in biodiversity assessments and
                    sustainable use of natural resources, as well as the
                    training and capacity building of local community members as
                    nature guides for ecotourism, has resulted in enhanced
                    livelihood opportunities with the steady flow of tourists
                    that are visiting this area to spot ‘bird and butterfly
                    specials’. This has further motivated the communities,
                    including those from neighboring villages, to take up
                    conservation and protect their natural resources.
                  </div>
                </div>
              </p>

              <p className="text-justify">
                The Tizu TVBCLN’s CCAs have yielded positive results in terms of
                sustainable use of biological resources by adopting long-term
                sustainability, enhanced governance and effective conservation
                of Socio-Economic Production Landscapes (SEPLs). Up-scaling of
                activities initiated by the communities will involve the
                formalization and mainstreaming of a network of CCAs in the
                State which are at par with India’s Protected Area (PA) network
                in conjunction with the Government of Nagaland. Given that 88.3%
                of forests are under the governance of the communities in
                Nagaland, the CCAs constitute the primary method for forest
                management and conservation of SEPLs in the State.{" "}
              </p>
              <p className="text-justify">
                The TVBCLN was awarded the India Biodiversity Awards 2018 under
                the Special mention Category for Sustainable Use of Biological
                Resources. TVBCLN works is mainly aligned with ‘SDG 15: Protect,
                restore and promote sustainable use of terrestrial ecosystems,
                sustainably manage forests, combat desertification, and halt and
                reverse land degradation and halt biodiversity loss’.
              </p>

              <p className="h5 text-justify font-weight-bold mt-4">
                Good Practice 3: ‘Myki’ of Women Resource Development Department
              </p>
              <p className="text-justify">
                Myki Initiative started under the Transformative Livelihood
                Intervention (TLI) Project of the Department of Women Resource
                Development which started in 2006. It is a comprehensive
                programme for the socio-economic empowerment of women of
                Nagaland, particularly the rural and urban poor women and the
                marginalized, by facilitating various income-generating
                activities to enable better and alternative means of livelihood.
                The name “Myki” was coined in the year 2009 to bring various
                products and produce of women in all categories so that a common
                platform can be set up to promote and facilitate the marketing
                of these goods under this brand name.
              </p>
              <p className="text-justify">
                During the initial years, women farmers/ groups were provided
                with necessary financial assistance and later various training
                on food processing were provided including pre-and postharvest
                management. Eventually, a Mini Fruit & Vegetable Processing
                Centre was set up during 2009-10 with the view to facilitating
                the promotion of the various products of women farmers/
                entrepreneurs/ SHGs/ societies, etc, including individuals. Over
                the years, the Centre has undergone revamping and upscaling with
                more new interventions by the Department to promote better
                quality products and provide employment opportunities to more
                women farmers. The Centre has been renamed as Food Processing
                cum Resource Centre which now supports around 100 women farmers/
                entrepreneurs annually who are into mini food processing
                activities. The centre now produces around 15 Myki Food
                Products.
              </p>
              <p className="text-justify">
                During 2018-19, ‘The Apparels & Accessories Production
                Programme’ was conceived to popularize Nagathemed fabrics with
                modern motifs and designs. It aims at manufacturing various
                indigenously designed attires and accessories, including paper
                carry bags and wrapping papers so designed to avoid the use of
                plastic bags, etc. at very affordable prices and has received
                accolades from a wide range of people, including domestic and
                foreign tourists, over the past years. Myki Products are being
                put on display and sale during various major events (Both in and
                outside State)and made available at both the Myki Stores in
                Kohima and Dimapur, including some select outlets. This
                initiative is primarily aligned with ‘SDG 8: Decent work and
                economic growth’.
              </p>
              <p className="text-justify">
                <div className="d-flex justify-content-center">
                  <img src="/dashboard/assets/practices/3.1.jpg" alt="" />
                </div>
              </p>
              <p className="h5 text-justify font-weight-bold mt-4">
                Good Practice 4: ‘Developing 100 Vegetable Village for 10,000
                households: Replication of Longkhum and Zhavame Village Model’
                of Horticulture Department
              </p>
              <p className="text-justify">
                <b>The Before:</b>&nbsp; Earlier in the State, there had been a
                scant number of vegetable villages growing vegetables on large
                scale, inadequate availability of good quality vegetable seeds
                or vegetable kit where mostly vegetable cultivation was carried
                out for home consumption. And also it was found that the most
                sought food items during the Covid-19 pandemic was vegetables
                other than cereals and pulses realizing the importance of
                vegetable cultivation.
              </p>
              <p className="text-justify">
                <b>The Interventions:</b>&nbsp; Considering the requirement of
                the production of more food and for selfsufficiency, the
                Department of Horticulture initiated this project for vegetable
                cultivation covering 10000 households in the villages across the
                State. Both summer and winter vegetable seeds were distributed
                during March 2021 and September 2021 respectively to the 100
                vegetable villages. Economic package in the form of vegetable
                seed Mini kits consisting of various vegetable seeds such as
                Potato, French bean, Okra, Carrot, Cabbage, Broccoli, Tomato,
                Brinjal, Pumpkin, Chilli, Cucumber, Bottle gourd, Soybean,
                Sesame, Peas, Naga Dal, Onion, Garlic, Ginger, Colocasia were
                distributed to the farming households to enhance production and
                for generating income to the farmers.
              </p>
              <p className="text-justify">
                <b>The After:</b>&nbsp; Through this project during 2021, the
                total vegetable production in the State has been enhanced by
                about 20-30% and has benefitted the farming communities in
                various ways such as 1) Improvement of rural livelihood for
                small landholding farmers 2) Nutritional food security for
                households through vegetable consumption. 3) Establishment of
                Community based vegetable cultivation 4) Sustainable
                climate-resilient vegetable farming technology and practices 5)
                Farmers’ access to markets 6) Achieving self-sufficiency,
                employment, and income generation
              </p>
              <p className="text-justify">
                <b>Key Success Factors:</b>&nbsp; Timely distribution of the
                vegetable seeds to the villages covering all the districts and
                conducting technical awareness training programme on sustainable
                vegetable farming were some of the key success factors. This
                initiative is primarily aligning with ‘SDG 2: Zero Hunger'.
              </p>
              <p className="text-justify">
                <b>Infographics:</b>&nbsp; 100 villages were benefited and
                10,000 households were covered under this project.
              </p>

              <p className="text-justify">
                <div className="d-flex justify-content-center">
                  <img src="/dashboard/assets/practices/4.1.jpg" alt="" />
                </div>
              </p>
              <p className="h5 text-justify font-weight-bold mt-4">
                Good Practice 5: ‘Institutionalization of reward and recognition
                mechanism for CHOs’ of Department of Health & Family Welfare
              </p>
              <p className="text-justify">
                The Community Health Officers (CHOs) at the Health and Wellness
                Centre (HWCs) are a new cadre, there is a strong need to
                motivate them to perform effectively and efficiently to deliver
                quality care. As the program matures, there would be a need to
                explore future trajectory avenues for career progression for
                CHOs in synergy with the public health cadre, as a means to
                ensure retention of the workforce and to keep them motivated.
              </p>
              <p className="text-justify">
                <div className="d-flex justify-content-center">
                  <img src="/dashboard/assets/practices/5.1.jpg" alt="" />
                </div>
              </p>
              <p className="text-justify">
                Reward and Recognition of CHOs were based on five thematic areas
                of service delivery, and daily and monthly reporting in the
                ABHWC portal. The 5 thematic areas are 1)Highest Institutional
                Delivery, 2)Highest Immunization coverage 3)Highest VHSND
                conducted 4)Highest patient footfall and 5) Highest IUCD
                insertion.{" "}
              </p>

              <p className="text-justify">
                The State HWC committee decided to take the above indicators as
                Nagaland record low institutional delivery, low immunization
                coverage, and high TFR. The record and reporting mechanism is
                also relatively poor and under-reporting in Nagaland. Therefore,
                to motivate and inculcate the importance of reporting, daily and
                monthly reporting in the HWC portal.
              </p>
              <p className="text-justify">
                Three days review meeting of CHOs was undertaken by the
                Department Chaired by Mission Director-NHM. All the CHOs were
                asked to present their activities and data collected from HMIS,
                RCH, and HWC portals were verified during the review meeting,
                and based on their performance, the best performing CHOs in 5
                areas were awarded. Consolation prizes were also given to the
                2nd best performing CHOs in those 5 areas. A certificate and sum
                of INR 7000 were awarded to those best performing CHO and
                consolation of INR 3000 was given as consolation.
              </p>
              <p className="text-justify">
                The benefits of reward and recognition mechanism are to motivate
                the CHOs for better performance, empower the CHOs for assuming
                the role of leaders of the primary healthcare team, to develop
                them as competent and confident leaders, ensure visibility of
                the cadre in different forums, enable active and visible
                partnership with the other medical professionals, support in
                professional development and promote them as Mentor, Coach or
                Leader. This initiative is primarily aligning with ‘SDG 3: Good
                Health and Well Being’.
              </p>
              <p className="h5 text-justify font-weight-bold mt-4">
                Good Practice 6: Amur Falcon Conservation Program at Pangti
                Village, Doyang, Wokha District, Nagaland:
              </p>
              <p className="text-justify">
                <b>THE BEFORE:</b>&nbsp; The Amur falcon is a species from the
                Siberian region which migrates to the African region for
                wintering covering a long distance of 22000 km and completing an
                elliptical loop. While migrating, it stops at several places in
                Northeast India with the main roosting site being Doyang
                catchment area in Nagaland, to fatten up before taking off
                again. In 2012 a Bangalore based NGO Conservation India came out
                with a report of mass killing of the birds in the Doyang
                catchment area, mostly in Pangti village which was widely
                publicized by the print and electronic media. Although it
                received a mixed response it succeeded in accelerating the
                conservation movement in Nagaland. This species is included
                under Schedule IV of the Wildlife Protection Act 1972 and India
                being signatory to the Convention on Migratory Species is duty
                bound to prevent the hunting of these migratory guests and
                provide a safe passage to them. The birds were trapped, killed
                and sold in the market in large number.
              </p>
              <p className="text-justify">
                <b>THE INTERVENTION: </b>&nbsp; The Forest Department deployed
                frontline staff at the roosting sites to control the killing
                trapping and selling of the birds. They seized all the traps
                nets used for capturing the birds all live birds were released
                and the dead were burnt. All the local law enforcement agencies
                such as Forest Police and Administration were alerted for
                further necessary action against recurrence. A Sub-committee
                consisting of all the Amur Falcon bearing territorial Divisional
                Forest Officers and Wildlife Warden has been constituted to
                monitor and supervise in the field level. Efforts have
                intensified since the year 2013. The Forest Department has
                evolved a multipronged strategy of awareness creation strict
                enforcement and alternate livelihood generation.
              </p>
              <p className="text-justify">
                Different kinds of awareness methodologies have been employed to
                cater to the needs of different groups of people at different
                times. In preparation of the arrival of these magnificent birds
                the Forest Department sounded a State level alert and began
                working stealthily well in advance. Awareness programs were also
                conducted for villagers Officers and staff of all forest
                division NGOs and students etc where they were apprised about
                the background biology behaviour and importance of the Amur
                Falcon. The Church being an organised institution and with a
                huge impact and reach among the masses moral or ethical
                education was carried out in coordination with the Pastors. They
                devoted Sunday devotional service to the issue followed by
                Signature Campaigns to save the Amur Falcon spreading
                centrifugally from Pangti village to Sungro Sanis and Englan
                Ranges which forms the catchment area of the Doyang reservoir.
                It culminated in a resolution taken up by the Kyong Baptist
                Ekhumkho Pastorden Sanrhyu which involves 138 churches of the
                Lotha community to pray for and support the initiative to
                protect the migratory bird during 53rd annual conference on Oct.
                2013. The Department plans to extend the activity to all
                churches in Nagaland through Nagaland Baptist Church Council.
                According to The Telegraph daily effort of this kind for
                conservation by the churches is unheard of anywhere.
              </p>
              <p className="text-justify">
                In the Amur falcon bearing areas Eco clubs under the Forest
                Departments flagship programme National Green Corps were given
                specific scientific input though presentations wildlife movie
                screenings storey telling etc. NGOs came forth with different
                education programmes for schools like Under the Canopy programme
                by the Friends of Amur Falcon an initiative by Nagaland Wildlife
                and Biodiversity Conservation Trust and Animal Action Education
                by the Natural Nagas and Wildlife Trust of India
              </p>
              <p className="text-justify">
                For legal awareness a workshop on relevant provisions of the
                Wildlife Protection Act 1972 was conducted for personnel of the
                Forest Department along with the District Administration Police
                Department village level law enforcing authorities NGOs and
                Fishermen Union etc. The local communities as a whole were
                involved in awareness seminars carried out by the Forest
                Department local NGOs covering different aspects of Amur Falcon
                conservation. It was a two way interaction to note the
                grievances of people as well as to come up with viable
                solutions. Open air wildlife movie screenings and community
                discussions were among the other means to reach out to the
                communities.{" "}
              </p>

              <p className="text-justify">
                Above all distribution of literature posters bookmarks hoardings
                etc are being done to generate widespread awareness about Amur
                Falcon. Flexi banners depicting slogans for Amur conservation
                and about the punitive measures as well have been put up in
                public places. Eco clubs of various schools have also put up
                banners in relevant areas. The Forest Department also used news
                dailies to spread awareness through the media by publishing
                relevant articles on conservation.
              </p>
              <p className="text-justify">
                Equal efforts were also put on the enforcement front. District
                Level Co-ordination Committee for controlling wildlife crime is
                formed in all the districts evolving Village Councils District
                Administration Police Department NGOs Revenue Department and
                other prominent community organisations. The Committee checks
                the bottlenecks like markets strategic transit routes through
                raids; patrolling is done regularly and check posts are
                established. Military and paramilitary forces have also been
                roped in for a similar purpose.
              </p>
              <p className="text-justify">
                Forest Protection Force is being deployed in strategic roosting
                sites every year and has been working round the clock for
                effective prevention and control of trapping and killing of the
                birds. Patrolling raids surprise checks and camping around the
                roosting sites are the most effective enforcement measures for
                the protection of Amur Falcon and is carried out by the Forest
                Protection Force till the birds leave.
              </p>
              <p className="text-justify">
                The state government has a notified policy of zero tolerance to
                the hunting killing trapping of the Amur falcons in the State
                with the penalty being withholding of Grant in aid to the
                defaulting villages and notifications regarding the same has
                been relayed by the Chief Secretary and the Director Rural
                Development Department. This action has immensely helped the
                conservation effort and the Forest Department has issued
                thousands of posters carrying the message of conservation on one
                side and the concerned notifications on the other.
              </p>
              <p className="text-justify font-weight-bold">THE AFTER:</p>
              <p className="text-justify ml-2">
                1. Selected for E Poster Presentation at World Parks Congress
                2014 Sydney Australia.
              </p>
              <p className="text-justify ml-2">
                2. Congratulatory note from Mr Bradnee Chambers Executive
                Secretary UNEP lauding the efforts of GoI Forest Department
                Nagaland and the communities for safeguarding and satellite
                tagging.
              </p>
              <p className="text-justify ml-2">
                3. Appreciation letter from China Bird watching Society Beijing
                and Wild Child Children Society Beijing; United Nations
                Environment Programme Convention on Migratory Species ; Bombay
                Natural History Society; The then Minister of Environment Forest
                and Climate Change Dr M Veerappa Moily; Director General of
                Forests Dr S S Garbyal IFS.
              </p>
              <p className="text-justify ml-2">
                4. Scientist from India and overseas stated the efforts were
                looked upon by the World Community for their wonderful efforts
                towards conservation of Forest and Wildlife particularly through
                the eyes of Amur Falcon. Dr. Suresh Kumar WII Dehradun. Nick
                William UNEP Peter Fehervari and Szabolcs Solt Birdlife Hungary.
              </p>

              <p className="text-justify ml-2">
                5. The Conservation Program had been recognised at different
                forums over the years and were the recipient of the followings:
              </p>
              <p className="text-justify ml-2">
                • Governors Commendation Certificate 15th August 2014 to the
                Nagaland Forest Protection Force.
              </p>
              <p className="text-justify ml-2">
                • Balipara Foundation Annual Awards 2014 at the ITA Machkkowa
                Guwahati Assam on November 7.
              </p>

              <p className="text-justify ml-2">
                • Royal Bank of Scotland Earth Heroes Awards 2014 in Save the
                species category. The award was given away by the then Union
                Minister of Environment Forest and Climate Change Prakash
                Javedekar.
              </p>
              <p className="text-justify ml-2">
                • Tigerland India Film Festival Award 2015
              </p>

              <p className="text-justify font-weight-bold">
                BENEFICIARY QUOTES:
              </p>
              <p className="text-justify">
                “Being a Lotha (Naga) mastered in hunting since time immemorial,
                Amur Falcons were hunted for consumption for over a decade.
                However, after the intervention by the Govt. and other NGOs,
                people of Pangti village accepted the importance of conservation
                and preservation of wildlife. Protection of the Amur Falcon,
                especially by the hardcore hunter (hunter turned
                conservationist), helped achieve ZERO HUNTING in 2014. The same
                has been maintained thus far. This is the biggest achievement so
                far and I am looking forward for the best- victory over random
                killing and hunting of wildlife. The Forest Department through
                various initiatives, has been very crucial and instrumental
                throughout this successful story” N. Thungbemo Shitiri,
                President Amur Falcon Roosting Area Union Pangti
              </p>
              <p className="text-justify font-weight-bold">GOAL IMPACT:</p>
              <p className="text-justify">
                1. A Conservation Action Plan of Amur Falcon which includes
                components like involvement in protection work self-help groups
                micro-financing eco-tourism habitat improvement and research
                have been prepared and is in place.
              </p>
              <p className="text-justify">
                2. Enhanced awareness on conservation issues amongst the public.
              </p>

              <p className="text-justify">
                3. Conservation and protection oriented convergence of various
                departmental programs of the government.
              </p>
              <p className="text-justify">
                4. Strengthened community protection squads with the involvement
                of the village council and the people.
              </p>
              <p className="text-justify">
                5. Full protection and almost zero killings of Amur falcon which
                has also been extended for other species too.
              </p>
              <p className="text-justify">
                6. More co operation of the sensitized public with the
                department and the government.
              </p>
              <p className="text-justify">
                7. Inclusion of Village Council, signing of MoU creation and
                support of Community Conservation areas with specific emphasis
                to roosting areas.
              </p>

              <p className="text-justify">
                8. In lieu of conservation developmental incentives for the
                villages were provided by forest department tourism department
                and by various NGOs. Deployment of village protection squad
                funded by the department and NGOs involved were done during the
                season.
              </p>
              <p className="text-justify">
                <b>KEY SUCCESS FACTORS:</b> Traditionally the people of the
                state are hunters and are still being practiced in isolated
                pockets till today. The low level of awareness amongst the
                public before the initiative had drastically reduced the
                population of wildlife of the state. This owing to the fact that
                the land and its resources belonged to the people and the state
                government with only 11.2 percent of the total geographical area
                under its control could not effectively stop the hunting
                processes for the last many years. With the massive surge in
                awareness campaign on protection of the birds through the
                involvement of local national and international media and ground
                level educational programmes of the department and its
                associated NGO partners and other government agencies there have
                been sea changes in the perception of the people vis-avis
                wildlife resources and its importance. Direct involvement of the
                Village council in protection process under the supervisory
                directives of the government has led to more effective
                management and better deliverance of various schemes and
                programs at the village level. This has led to the strengthening
                of the village institutions whereby in many villages local
                wildlife protection squads and volunteers have emerged. Other
                NGOs like the church bodies student organizations schools and
                colleges etc have also been positively shaped to face
                challenging situations and are more enthusiastic on conservation
                issues. This initiative has also strengthened the Forest
                department and the government agencies for better collaboration
                and effective delivery mechanism with renewed skill and
                knowledge. The organization of UNEP has termed “ Amur falcon
                capital of the World ”
              </p>
              <p className="text-justify font-weight-bold">INFOGRAPHICS:</p>
              <p className="text-justify">
                • Total number of villages/local bodies involved :Approximately
                13 villages with focussed attention on Pangti Village
              </p>

              <p className="text-justify">
                • Total number of women/girls benefitted : Approximately 2000
              </p>
              <p className="text-justify">
                • Total number of families benefitted : Approximately 1500
              </p>
              <p className="text-justify font-weight-bold">
                PHOTOGARPHS/IMAGES:
              </p>
              <p className="text-justify">
                <div className="d-flex justify-content-center">
                  <img src="/dashboard/assets/practices/6.1.jpg" alt="" />
                </div>
              </p>
              <p className="text-center">
                Amur Flacon at roosting site in Wokha District, Nagaland
              </p>
              <p className="text-justify">
                <div className="d-flex justify-content-center">
                  <img src="/dashboard/assets/practices/6.2.jpg" alt="" />
                </div>
              </p>
              <p className="text-center">
                Awareness creation camp among villagers on conservation of Amur
                Falcons carried out by Forest Department, Government of Nagaland
              </p>
              <p className="text-justify">
                <div className="d-flex justify-content-center">
                  <img src="/dashboard/assets/practices/6.3.jpg" alt="" />
                </div>
              </p>
              <p className="text-center">
                Former Hon’ble CM of Nagaland releasing the satellite tagged
                Amur Falcon at Itanki National Park, Nagaland
              </p>
              <p className="text-justify">
                <div className="d-flex justify-content-center">
                  <img src="/dashboard/assets/practices/6.4.jpg" alt="" />
                </div>
              </p>
              <p className="text-center">
                Release of special postal cover on satellite tagging of Amur
                Falcon by Forest Department in association with the Postal
                Department
              </p>
              <p className="text-justify">
                <div className="d-flex justify-content-center">
                  <img src="/dashboard/assets/practices/6.5.jpg" alt="" />
                </div>
              </p>
              <p className="text-center">
                Digital Eco-tourism Promotion by Forest Department, Government
                of Nagaland
              </p>
              <p className="text-justify mt-2">Reference links:</p>
              <p className="text-justify">
                1. Video:{" "}
                <a
                  href="https://www.youtube.com/watch?v=uzKjttzZOKU"
                  target="_blank"
                  className="text-primary font-weight-bold"
                >
                  BBC coverage
                </a>
              </p>
              <p className="text-justify">
                2.{" "}
                <a
                  href="https://www.bbc.com/news/world-asia-india-29983748"
                  target="_blank"
                  className="text-primary font-weight-bold"
                >
                  BBC News Article
                </a>
              </p>
            </Card>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { timezone } = authUser;

  return {
    timezone,
  };
};

const mapActionsToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapActionsToProps)(BestPractices);
