import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

const brandImagePools: Record<string, string[]> = {
  "Mercedes-Benz": [
    "1618843479313-40f8afb4b4d8","1553440569-bcc63803a83d","1549399542-7e3f8b79c341",
    "1590216255837-24412b004996","1594096838285-e5c1de02a0c7","1615228939096-9ead6c74008e",
    "1654441796759-face90b2ae78","1659112007939-d418fc27c6cf","1661291799936-964179666b1d",
    "1661891539075-24b4e473f67f","1689170649732-64e376abe763","1689170649735-a8c259851e2d",
    "1689170650095-9bb7f5164599","1689170652466-1bfee78f78b1","1691520971817-835780eb5e5c",
    "1694535047842-52ad9da81015","1697884434575-29d0cbd3cfc5","1715951874521-3ff2297a238b",
    "1715951875729-9aca307e6af9","1727243926638-8690df4e6ab1","1728419694854-7848ad37e9e5",
    "1737189379619-5bbd399bc94a","1737780075114-103596d69c3f"
  ],
  "BMW": [
    "1555215695-3004980adade","1607853202273-797f1c22a38e","1570356528233-b442cf2de345",
    "1576289681078-d32a1bdcf9b5","1580273916550-e323be2ae537","1580568290998-7a7bc95f14ec",
    "1583356322882-85559b472f56","1601362840469-51e4d8d58785","1603386329225-868f9b1ee6c9",
    "1610716676800-a18b4a4e62f5","1612545667889-b061512d0dfa","1614288532696-203f89dc0db4",
    "1616455579100-2ceaa4eb2d37","1622642468182-edd7db43f86e","1626381958625-f4e4ea343925",
    "1653227174943-2908ffc48237","1676761136448-d160bcd84ddc","1677564923729-5eeacd594495",
    "1682125731656-76a74c4b7395","1690441053731-600981d923ab","1694207303871-bcc2ac5d855f",
    "1694523228738-53382fa76311"
  ],
  "Porsche": [
    "1503376780353-7e6692767b70","1544829099-f583c61fd8b2","1614162694902-eb2c6273116c",
    "1579529827151-45055dc0093f","1592689219633-df3dd3a3b877","1619844175408-c05947985e2d",
    "1628149611399-d5f7b6723a90","1629551277734-3e9fb7e7706d","1665065070620-16c8f16b63c2",
    "1677993185892-f7823f314c4c","1680530943604-39ea7d8cafd7","1686730540270-93f2c33351b6",
    "1696581081899-90bc037831bb","1696581081921-cd8ae847556c","1696581082754-896e5d611bb8",
    "1696585537688-a13b20633a78","1698584705521-87aec9f7bcbe","1708019892601-bf728ba24028",
    "1711903030228-d060d867ab70","1713757553809-9cf110ac3188","1722445716692-99fcdf65c541",
    "1737182592549-0c83f93e2903","1737677106884-ba2bd558e7db"
  ],
  "Audi": [
    "1603584173870-7f23fdae1b7a","1606664515524-ed2f786a0bd6","1605515298946-d062f2e9da53",
    "1540066019607-e5f69323a8dc","1541348263662-e068662d82af","1541800658-6599fffd81c1",
    "1555652736-e92021d28a10","1556391362-d3d11d98e510","1606152421802-db97b9c7a11b",
    "1606664914460-b667528c1acc","1612956946912-b2d8e5fd65a8","1616422285623-13ff0162193c",
    "1617195920950-1145bf9a9c72","1624001010212-f7bfd7cc74cb","1657779912012-a5e59905ffdc",
    "1657779912132-be6f76df2b47","1661868739531-c501499b0fff","1661891539075-24b4e473f67f",
    "1682125851025-86a9b8f80f05","1683134240084-ba074973f75e","1690441053731-600981d923ab"
  ],
  "Lexus": [
    "1621007947382-bb3c3968e3bb","1628188687881-0a34984b3531","1628188859552-132bbeac6204",
    "1628188869280-0210bf9b2dc2","1641424016274-71cd4e5c61a5","1641815217575-b38dcbf99daf",
    "1653308034233-3dc7f0764d62","1661993745859-b72953c800e9","1661993745907-01b0d887eedd",
    "1661993746164-752a89fc7822","1664427320994-6e27b8f1171f","1664427321010-80c509edb4d1",
    "1664427321044-b4057f77777e","1664427356346-c31b46248e71","1669691101370-9ee9ee0782dc",
    "1690441053731-600981d923ab"
  ],
  "Land Rover": [
    "1606220838315-056192d5e927","1563720223185-11003d516935","1506616995931-556bc0c90c16",
    "1546982491-7e976db2dc82","1549632891-a0bea6d0355b","1555404610-4f6162df064d",
    "1597220602515-eb4471175886","1614104422336-f08439a8262c","1614480634012-bd527ab7f86d",
    "1650333031701-f0b6fb2f5dca","1650333034432-2650a493b66f","1650333034437-55db7ab0cadc",
    "1655468332000-18ecac4ab2c8","1658328565500-c5c668e6a52b","1664469174245-926f090d2162",
    "1664991306550-53688fc6780e","1690441053731-600981d923ab"
  ],
  "Bentley": [
    "1566008885218-90abf9200ddb","1471289549423-04adaecfa1f1","1614273444999-124c90173155",
    "1617566347924-ad5ebdaa014e","1629820402094-3c745c386950","1629820405921-b2760b3e7e62",
    "1629820408206-e9fc918abf63","1633301538840-d03dde57e428","1637950634698-2e27e3d6f3db",
    "1647104398147-6cbc25aaf962","1647156460624-09e32880030b","1662929733709-f52e7306e1c0",
    "1678478615024-412f8eab44fa","1693773763527-ace4b1d8db10","1694397360728-f5e6caa43055",
    "1712735251121-afdf260e6d3a"
  ],
  "McLaren": [
    "1544636331-e26879cd4d9b","1614200179396-2bdb77ebf81b","1611251509483-b3a25bf8e312",
    "1634327760697-f3d854700444","1644876217840-b1f6072ebebf","1659946431232-e2b25255296a",
    "1659946431273-5cfabfa85197","1659946431295-24d46882dc11","1663950995404-e18773895f8c",
    "1664565240228-0d8a889399aa","1664637351074-6f91797711ed","1669644767263-d2440218af38",
    "1678026039586-39888a15c0f2","1680365565306-da29d8864532","1690441053731-600981d923ab",
    "1691443297137-68818fe7bce9","1693934566114-3ddcc2dfc759"
  ],
  "Rolls-Royce": [
    "1631295868223-63265b40d9e4","1506610654-064fbba4780c","1557053965-459050b06844",
    "1599912027611-484b9fc447af","1610478920626-fb94a144840b","1619362360115-f57612eda98d",
    "1624804269473-828dcc30a210","1625510872834-7db6c4273870","1650741064255-69aec2144873",
    "1650741064294-bc2fccbf8174","1651065839649-c71cfd51dfad","1654021610606-bf229a2e27e5",
    "1657073536501-9713440d04be","1693773766468-93888454846f","1693840263722-742d5990181a"
  ],
  "Aston Martin": [
    "1617788138017-80ad40651399","1569399078436-da10fbd60f12","1569399081479-fffa3608c28c",
    "1630683743045-76ef9f619445","1630683743853-bd7a449190df","1630683744364-0b49bd336033",
    "1630683744832-dc4a0c42ef4a","1658485959228-f293eb2d4a0e","1691006962631-2e167b93bbb3",
    "1693164364543-a2fde8ce2d3f","1693840263722-742d5990181a","1705933494267-62ad20b05fa9",
    "1705933494359-a6b4470c51c3","1710210123638-503223b8f4af","1710210123742-52dc0012bc8a",
    "1726739570049-23d9780fe3ca"
  ],
  "Tesla": [
    "1617788138017-80ad40651399","1560958089-b8a1929cea89","1536700503339-1e4b06520771",
    "1541447270888-83e8494f9c06","1553260202-d1f2ce03298b","1561580125-028ee3bd62eb",
    "1571987502227-9231b837d92a","1579782647395-2e6fb36a64f2","1606016159991-dfe4f2746ad5",
    "1617704548623-340376564e68","1620891549027-942fdc95d3f5","1676856577533-1e8099932f7b",
    "1676945009341-4bb62b036653","1681987448226-f8feb59a58e9","1708953609405-96cb857fc9f6"
  ],
  "Lamborghini": [
    "1511919884226-fd3cad34687c","1532581140115-3e355d1ed1de","1507767439269-2c64f107e609",
    "1513036191774-b2badb8fcb76","1530906358829-e84b2769270f","1549458395-e14f2e6d39c7",
    "1570294646112-27ce4f174e38","1571607388263-1044f9ea01dd","1593219535889-7873a100874a",
    "1600510424051-30d592a75353","1611900713725-864f48309d67","1618846446712-a4eda2adc05f",
    "1632479803237-53e868bb2133","1657217674164-9cbf85acfc6d","1657769106786-b6f50ac90f5f",
    "1664304598312-6de674eb1b79","1687153733088-9fc19cbc59bf","1690441053731-600981d923ab",
    "1694397360721-960ace109c8a","1737182592549-0c83f93e2903"
  ],
  "Ferrari": [
    "1583121274602-3e2820c69888","1592198084033-aade902d1aae","1555472287-01af5165c01c",
    "1608134021189-985922ce9643","1614200187524-dc4b892acf16","1618102973579-3c685d015d2",
    "1618846446712-a4eda2adc05f","1667852692506-7fce58cbb87e","1667852692583-4d961cca1af2",
    "1671144297685-9be350b5bb74","1672598589892-6a73a73a09d5","1672598593564-dea0a73a09d5",
    "1672598595501-17cf520aa895","1672598617789-26cd01663bf2","1672598622436-4b4f019c732b",
    "1708019931163-a3298faf915d","1737559694304-416b71aa83f0","1737597230600-0a202c0b78b5",
    "1737677106508-91f7f4e1468e","1737708000164-72fcfbe4a79f"
  ],
  "Maserati": [
    "1575888787260-41970fb14803","1586012512065-111aadb16adf","1615285431384-4f8888064be2",
    "1638261693909-cbeddb7c261c","1649162481463-69c2df688269","1653417580711-b43c9deb0d64",
    "1653417592160-555cd45a6ff9","1680744764636-60dfa5471940","1683620857361-eb1b0c41af85",
    "1692966307722-16585d212b8d","1692966307722-d8dc2bfd52c4","1692966307723-8184a73e750c",
    "1692966307724-fd6ea3b9ba92","1692966307725-597819d66adb","1692966307728-1d615077f813"
  ],
  "Jaguar": [
    "1502877947493-61dd3b901668","1507136566006-cfc505b114fc","1519381843062-c8b7bc45f987",
    "1562783912-21ad31ee2a83","1568954264801-622ec5bd5cd5","1575496917055-f23c822796eb",
    "1589134723101-5abd32593adf","1592252824871-63d7b594f251","1592929881470-65c6db486987",
    "1597220669155-4a3e59232dc9","1611859266238-4b98091d9d9b","1616276143706-99cf5a26038a",
    "1630045698239-316e53b75048","1630045859985-0c577fa864de","1654021611269-f2cff85cf604"
  ],
};

const brands = [
  {
    make: "Mercedes-Benz",
    models: [
      { model: "C 300", trim: "4MATIC", body: "Sedan", priceBase: 52000, msrpMult: 1.15 },
      { model: "E 450", trim: "4MATIC", body: "Sedan", priceBase: 72000, msrpMult: 1.12 },
      { model: "S 580", trim: "4MATIC", body: "Sedan", priceBase: 145000, msrpMult: 1.14 },
      { model: "GLE 53", trim: "AMG", body: "SUV", priceBase: 88000, msrpMult: 1.10 },
      { model: "GLS 600", trim: "Maybach", body: "SUV", priceBase: 185000, msrpMult: 1.16 },
      { model: "AMG GT", trim: "Black Series", body: "Coupe", priceBase: 185000, msrpMult: 1.20 },
      { model: "G 63", trim: "AMG", body: "SUV", priceBase: 195000, msrpMult: 1.25 },
      { model: "SL 55", trim: "AMG", body: "Convertible", priceBase: 142000, msrpMult: 1.13 },
      { model: "CLS 450", trim: "4MATIC", body: "Sedan", priceBase: 78000, msrpMult: 1.11 },
      { model: "Maybach S 680", trim: "4MATIC", body: "Sedan", priceBase: 230000, msrpMult: 1.15 },
    ],
  },
  {
    make: "BMW",
    models: [
      { model: "330i", trim: "M Sport", body: "Sedan", priceBase: 48000, msrpMult: 1.14 },
      { model: "M3", trim: "Competition", body: "Sedan", priceBase: 84000, msrpMult: 1.12 },
      { model: "M4", trim: "Competition", body: "Coupe", priceBase: 86000, msrpMult: 1.12 },
      { model: "740i", trim: "M Sport", body: "Sedan", priceBase: 94000, msrpMult: 1.13 },
      { model: "X5 M", trim: "Competition", body: "SUV", priceBase: 115000, msrpMult: 1.10 },
      { model: "X7", trim: "M60i", body: "SUV", priceBase: 108000, msrpMult: 1.11 },
      { model: "M5 CS", trim: "", body: "Sedan", priceBase: 145000, msrpMult: 1.15 },
      { model: "iX", trim: "M60", body: "SUV", priceBase: 112000, msrpMult: 1.10 },
      { model: "Z4 M40i", trim: "", body: "Convertible", priceBase: 66000, msrpMult: 1.13 },
      { model: "XM", trim: "Label Red", body: "SUV", priceBase: 185000, msrpMult: 1.18 },
    ],
  },
  {
    make: "Porsche",
    models: [
      { model: "911 Carrera", trim: "", body: "Coupe", priceBase: 118000, msrpMult: 1.15 },
      { model: "911 Turbo S", trim: "", body: "Coupe", priceBase: 235000, msrpMult: 1.13 },
      { model: "Cayman GTS", trim: "4.0", body: "Coupe", priceBase: 92000, msrpMult: 1.12 },
      { model: "Panamera 4S", trim: "E-Hybrid", body: "Sedan", priceBase: 115000, msrpMult: 1.11 },
      { model: "Taycan Turbo", trim: "", body: "Sedan", priceBase: 155000, msrpMult: 1.10 },
      { model: "Macan GTS", trim: "", body: "SUV", priceBase: 86000, msrpMult: 1.12 },
      { model: "Cayenne Turbo GT", trim: "", body: "SUV", priceBase: 198000, msrpMult: 1.10 },
      { model: "718 Boxster", trim: "GTS 4.0", body: "Convertible", priceBase: 95000, msrpMult: 1.13 },
      { model: "911 GT3", trim: "Touring", body: "Coupe", priceBase: 225000, msrpMult: 1.18 },
      { model: "Cayenne Coupe", trim: "Turbo", body: "SUV", priceBase: 135000, msrpMult: 1.11 },
    ],
  },
  {
    make: "Audi",
    models: [
      { model: "A4", trim: "Prestige", body: "Sedan", priceBase: 52000, msrpMult: 1.13 },
      { model: "A6", trim: "55 TFSI", body: "Sedan", priceBase: 66000, msrpMult: 1.12 },
      { model: "A8 L", trim: "60 TFSI", body: "Sedan", priceBase: 92000, msrpMult: 1.14 },
      { model: "Q5", trim: "Prestige", body: "SUV", priceBase: 58000, msrpMult: 1.11 },
      { model: "Q7", trim: "Prestige", body: "SUV", priceBase: 72000, msrpMult: 1.10 },
      { model: "Q8", trim: "S line", body: "SUV", priceBase: 78000, msrpMult: 1.12 },
      { model: "e-tron GT", trim: "RS", body: "Sedan", priceBase: 145000, msrpMult: 1.10 },
      { model: "RS 6", trim: "Avant", body: "Wagon", priceBase: 125000, msrpMult: 1.12 },
      { model: "RS Q8", trim: "", body: "SUV", priceBase: 128000, msrpMult: 1.11 },
      { model: "R8 V10", trim: "Performance", body: "Coupe", priceBase: 195000, msrpMult: 1.13 },
    ],
  },
  {
    make: "Lexus",
    models: [
      { model: "ES 350", trim: "Ultra Luxury", body: "Sedan", priceBase: 52000, msrpMult: 1.10 },
      { model: "IS 500", trim: "F Sport", body: "Sedan", priceBase: 62000, msrpMult: 1.12 },
      { model: "LS 500", trim: "F Sport", body: "Sedan", priceBase: 88000, msrpMult: 1.13 },
      { model: "RX 350", trim: "L Luxury", body: "SUV", priceBase: 58000, msrpMult: 1.10 },
      { model: "GX 460", trim: "Luxury", body: "SUV", priceBase: 68000, msrpMult: 1.11 },
      { model: "LX 600", trim: "Ultra Luxury", body: "SUV", priceBase: 105000, msrpMult: 1.12 },
      { model: "LC 500", trim: "Convertible", body: "Convertible", priceBase: 105000, msrpMult: 1.13 },
      { model: "UX 250h", trim: "F Sport", body: "SUV", priceBase: 42000, msrpMult: 1.10 },
      { model: "NX 350", trim: "F Sport", body: "SUV", priceBase: 49000, msrpMult: 1.11 },
      { model: "RC F", trim: "Track Edition", body: "Coupe", priceBase: 88000, msrpMult: 1.14 },
    ],
  },
  {
    make: "Land Rover",
    models: [
      { model: "Defender 110", trim: "X-Dynamic", body: "SUV", priceBase: 78000, msrpMult: 1.12 },
      { model: "Range Rover Sport", trim: "Autobiography", body: "SUV", priceBase: 125000, msrpMult: 1.14 },
      { model: "Range Rover Velar", trim: "R-Dynamic", body: "SUV", priceBase: 72000, msrpMult: 1.13 },
      { model: "Discovery", trim: "Metropolitan", body: "SUV", priceBase: 75000, msrpMult: 1.11 },
      { model: "Defender 90", trim: "Carpathian", body: "SUV", priceBase: 82000, msrpMult: 1.15 },
      { model: "Range Rover Evoque", trim: "Autobiography", body: "SUV", priceBase: 58000, msrpMult: 1.12 },
      { model: "Discovery Sport", trim: "R-Dynamic", body: "SUV", priceBase: 52000, msrpMult: 1.11 },
      { model: "Range Rover", trim: "SV", body: "SUV", priceBase: 215000, msrpMult: 1.16 },
      { model: "Defender 130", trim: "Outbound", body: "SUV", priceBase: 88000, msrpMult: 1.13 },
      { model: "Velar", trim: "P400", body: "SUV", priceBase: 68000, msrpMult: 1.12 },
    ],
  },
  {
    make: "Bentley",
    models: [
      { model: "Continental GT", trim: "Speed", body: "Coupe", priceBase: 245000, msrpMult: 1.16 },
      { model: "Flying Spur", trim: "Azure", body: "Sedan", priceBase: 210000, msrpMult: 1.14 },
      { model: "Bentayga", trim: "Speed", body: "SUV", priceBase: 235000, msrpMult: 1.15 },
      { model: "Continental GTC", trim: "Mulliner", body: "Convertible", priceBase: 285000, msrpMult: 1.15 },
      { model: "Bentayga Speed", trim: "", body: "SUV", priceBase: 265000, msrpMult: 1.14 },
      { model: "Flying Spur Mulliner", trim: "", body: "Sedan", priceBase: 310000, msrpMult: 1.16 },
      { model: "Continental GT Speed", trim: "", body: "Coupe", priceBase: 295000, msrpMult: 1.15 },
      { model: "Bentayga Azure", trim: "", body: "SUV", priceBase: 255000, msrpMult: 1.14 },
      { model: "Flying Spur S", trim: "", body: "Sedan", priceBase: 235000, msrpMult: 1.13 },
      { model: "Continental GT Mulliner", trim: "", body: "Coupe", priceBase: 335000, msrpMult: 1.16 },
    ],
  },
  {
    make: "McLaren",
    models: [
      { model: "720S", trim: "Performance", body: "Coupe", priceBase: 310000, msrpMult: 1.15 },
      { model: "Artura", trim: "", body: "Coupe", priceBase: 245000, msrpMult: 1.12 },
      { model: "GT", trim: "Luxury", body: "Coupe", priceBase: 215000, msrpMult: 1.14 },
      { model: "765LT", trim: "Spider", body: "Convertible", priceBase: 385000, msrpMult: 1.13 },
      { model: "750S", trim: "", body: "Coupe", priceBase: 325000, msrpMult: 1.12 },
      { model: "Senna", trim: "", body: "Coupe", priceBase: 850000, msrpMult: 1.20 },
      { model: "570S", trim: "", body: "Coupe", priceBase: 195000, msrpMult: 1.15 },
      { model: "600LT", trim: "Spider", body: "Convertible", priceBase: 265000, msrpMult: 1.14 },
      { model: "P1", trim: "", body: "Coupe", priceBase: 1200000, msrpMult: 1.25 },
      { model: "Speedtail", trim: "", body: "Coupe", priceBase: 2100000, msrpMult: 1.20 },
    ],
  },
  {
    make: "Rolls-Royce",
    models: [
      { model: "Ghost", trim: "Black Badge", body: "Sedan", priceBase: 385000, msrpMult: 1.16 },
      { model: "Phantom", trim: "", body: "Sedan", priceBase: 465000, msrpMult: 1.15 },
      { model: "Cullinan", trim: "Black Badge", body: "SUV", priceBase: 385000, msrpMult: 1.16 },
      { model: "Wraith", trim: "Black Badge", body: "Coupe", priceBase: 345000, msrpMult: 1.15 },
      { model: "Dawn", trim: "Black Badge", body: "Convertible", priceBase: 365000, msrpMult: 1.16 },
      { model: "Spectre", trim: "", body: "Coupe", priceBase: 425000, msrpMult: 1.14 },
      { model: "Black Badge Ghost", trim: "", body: "Sedan", priceBase: 435000, msrpMult: 1.15 },
      { model: "Black Badge Cullinan", trim: "", body: "SUV", priceBase: 435000, msrpMult: 1.15 },
      { model: "Phantom EWB", trim: "", body: "Sedan", priceBase: 545000, msrpMult: 1.16 },
      { model: "Ghost Extended", trim: "", body: "Sedan", priceBase: 435000, msrpMult: 1.15 },
    ],
  },
  {
    make: "Aston Martin",
    models: [
      { model: "DBX", trim: "707", body: "SUV", priceBase: 178000, msrpMult: 1.15 },
      { model: "DB11", trim: "AMR", body: "Coupe", priceBase: 220000, msrpMult: 1.14 },
      { model: "Vantage", trim: "F1 Edition", body: "Coupe", priceBase: 155000, msrpMult: 1.13 },
      { model: "DBS", trim: "770 Ultimate", body: "Coupe", priceBase: 325000, msrpMult: 1.16 },
      { model: "Valkyrie", trim: "", body: "Coupe", priceBase: 3000000, msrpMult: 1.20 },
      { model: "DB12", trim: "", body: "Coupe", priceBase: 245000, msrpMult: 1.14 },
      { model: "Rapide", trim: "S", body: "Sedan", priceBase: 210000, msrpMult: 1.15 },
      { model: "Vantage F1", trim: "", body: "Coupe", priceBase: 165000, msrpMult: 1.13 },
      { model: "DBX707", trim: "", body: "SUV", priceBase: 245000, msrpMult: 1.15 },
      { model: "DBS 770", trim: "Ultimate", body: "Coupe", priceBase: 385000, msrpMult: 1.16 },
    ],
  },
  {
    make: "Tesla",
    models: [
      { model: "Model S Plaid", trim: "", body: "Sedan", priceBase: 115000, msrpMult: 1.15 },
      { model: "Model 3 Performance", trim: "", body: "Sedan", priceBase: 55000, msrpMult: 1.14 },
      { model: "Model X Plaid", trim: "", body: "SUV", priceBase: 125000, msrpMult: 1.15 },
      { model: "Model Y Performance", trim: "", body: "SUV", priceBase: 55000, msrpMult: 1.14 },
      { model: "Cybertruck", trim: "Foundation", body: "Truck", priceBase: 105000, msrpMult: 1.12 },
      { model: "Model S", trim: "Dual Motor", body: "Sedan", priceBase: 82000, msrpMult: 1.15 },
      { model: "Model 3", trim: "Long Range", body: "Sedan", priceBase: 42000, msrpMult: 1.14 },
      { model: "Model X", trim: "Dual Motor", body: "SUV", priceBase: 82000, msrpMult: 1.15 },
      { model: "Model Y", trim: "Long Range", body: "SUV", priceBase: 48000, msrpMult: 1.14 },
      { model: "Roadster", trim: "Founders", body: "Convertible", priceBase: 250000, msrpMult: 1.20 },
    ],
  },
  {
    make: "Lamborghini",
    models: [
      { model: "Huracan Evo", trim: "", body: "Coupe", priceBase: 215000, msrpMult: 1.15 },
      { model: "Urus", trim: "Performante", body: "SUV", priceBase: 235000, msrpMult: 1.17 },
      { model: "Aventador", trim: "SVJ", body: "Coupe", priceBase: 525000, msrpMult: 1.20 },
      { model: "Huracan STO", trim: "", body: "Coupe", priceBase: 335000, msrpMult: 1.14 },
      { model: "Urus Performante", trim: "", body: "SUV", priceBase: 265000, msrpMult: 1.16 },
      { model: "Revuelto", trim: "", body: "Coupe", priceBase: 600000, msrpMult: 1.18 },
      { model: "Huracan Tecnica", trim: "", body: "Coupe", priceBase: 245000, msrpMult: 1.14 },
      { model: "Aventador SVJ", trim: "Roadster", body: "Convertible", priceBase: 585000, msrpMult: 1.20 },
      { model: "Gallardo", trim: "LP 560-4", body: "Coupe", priceBase: 155000, msrpMult: 1.15 },
      { model: "Countach LPI", trim: "800-4", body: "Coupe", priceBase: 2650000, msrpMult: 1.25 },
    ],
  },
  {
    make: "Ferrari",
    models: [
      { model: "296 GTB", trim: "", body: "Coupe", priceBase: 335000, msrpMult: 1.14 },
      { model: "SF90 Stradale", trim: "", body: "Coupe", priceBase: 530000, msrpMult: 1.15 },
      { model: "Roma", trim: "", body: "Coupe", priceBase: 245000, msrpMult: 1.13 },
      { model: "F8 Tributo", trim: "", body: "Coupe", priceBase: 285000, msrpMult: 1.14 },
      { model: "812 Superfast", trim: "", body: "Coupe", priceBase: 345000, msrpMult: 1.15 },
      { model: "Portofino", trim: "M", body: "Convertible", priceBase: 245000, msrpMult: 1.13 },
      { model: "LaFerrari", trim: "", body: "Coupe", priceBase: 1500000, msrpMult: 1.25 },
      { model: "488 Pista", trim: "", body: "Coupe", priceBase: 335000, msrpMult: 1.14 },
      { model: "California T", trim: "", body: "Convertible", priceBase: 205000, msrpMult: 1.15 },
      { model: "GTC4Lusso", trim: "", body: "Coupe", priceBase: 305000, msrpMult: 1.14 },
    ],
  },
  {
    make: "Maserati",
    models: [
      { model: "Ghibli", trim: "Trofeo", body: "Sedan", priceBase: 85000, msrpMult: 1.15 },
      { model: "Quattroporte", trim: "Trofeo", body: "Sedan", priceBase: 155000, msrpMult: 1.14 },
      { model: "Levante", trim: "Trofeo", body: "SUV", priceBase: 155000, msrpMult: 1.15 },
      { model: "MC20", trim: "Cielo", body: "Coupe", priceBase: 225000, msrpMult: 1.13 },
      { model: "GranTurismo", trim: "Folgore", body: "Coupe", priceBase: 195000, msrpMult: 1.14 },
      { model: "Grecale", trim: "Trofeo", body: "SUV", priceBase: 105000, msrpMult: 1.15 },
      { model: "Levante Trofeo", trim: "", body: "SUV", priceBase: 165000, msrpMult: 1.15 },
      { model: "Quattroporte Trofeo", trim: "", body: "Sedan", priceBase: 175000, msrpMult: 1.14 },
      { model: "Ghibli Trofeo", trim: "", body: "Sedan", priceBase: 115000, msrpMult: 1.15 },
      { model: "GranCabrio", trim: "Trofeo", body: "Convertible", priceBase: 205000, msrpMult: 1.14 },
    ],
  },
  {
    make: "Jaguar",
    models: [
      { model: "F-PACE", trim: "SVR", body: "SUV", priceBase: 88000, msrpMult: 1.15 },
      { model: "XF", trim: "R-Dynamic", body: "Sedan", priceBase: 62000, msrpMult: 1.13 },
      { model: "F-TYPE", trim: "R75", body: "Convertible", priceBase: 115000, msrpMult: 1.14 },
      { model: "XE", trim: "R-Dynamic", body: "Sedan", priceBase: 52000, msrpMult: 1.13 },
      { model: "I-PACE", trim: "HSE", body: "SUV", priceBase: 72000, msrpMult: 1.12 },
      { model: "XJ", trim: "R575", body: "Sedan", priceBase: 95000, msrpMult: 1.15 },
      { model: "E-PACE", trim: "R-Dynamic", body: "SUV", priceBase: 48000, msrpMult: 1.13 },
      { model: "F-TYPE R", trim: "Coupe", body: "Coupe", priceBase: 110000, msrpMult: 1.14 },
      { model: "XF Sportbrake", trim: "S", body: "Wagon", priceBase: 72000, msrpMult: 1.13 },
      { model: "I-PACE HSE", trim: "", body: "SUV", priceBase: 78000, msrpMult: 1.12 },
    ],
  },
];

const colors = ["Obsidian Black","Alpine White","Midnight Blue","Rosso Corsa","Gunmetal Grey","Atomic Silver","British Racing Green","Volcano Red","Nardo Grey","Caviar Black","Carrara White","Belgravia Green","Dark Sapphire","Papaya Spark","Pearl White","Giallo Auge","Frozen Dark Grey","Selenite Grey","Hotspur","Tailored Purple","Bordeaux Red","Macchiato Beige","Black Merino","Oxford Tan","Cream","Nero Ade","White Hemp","Perlino","Black","Q Xenon Grey"];
const interiors = ["Black Leather","Macchiato Beige","Bordeaux Red","Hotspur","Cream","Oxford Tan","Nero Ade","White Hemp","Perlino","Black Merino","Tailored Purple","Cognac","Saddle Brown","Ice Grey","Red Stitching"];
const transmissions = ["Automatic","Dual-Clutch","PDK","8-Speed Auto","9-Speed Auto","CVT","Single-Speed","7-Speed DCT","10-Speed Auto"];
const engines = ["2.0L Inline-4 Turbo","3.0L Inline-6 Turbo","4.0L V8 Biturbo","4.4L V8 TwinPower","5.0L V8 Supercharged","6.0L W12 TSI","6.75L V12 Twin-Turbo","3.5L V6 Twin-Turbo","4.0L V8 Twin-Turbo","5.2L V10 Naturally Aspirated","3.9L V8 Twin-Turbo","6.5L V12 Naturally Aspirated","Tri-Motor Electric","Dual-Motor Electric","3.8L Twin-Turbo Flat-6","2.9L V6 Twin-Turbo","3.0L V6 Hybrid"];
const fuelTypes = ["Gasoline","Electric","Hybrid","Diesel"];
const driveTypes = ["AWD","RWD","FWD"];
const featuresPool = ["Leather Seats","Sunroof","Navigation","Premium Audio","Adaptive Cruise","Lane Keep Assist","Blind Spot Monitor","Heated Seats","Ventilated Seats","Massage Seats","Panoramic Roof","Head-Up Display","Wireless Charging","Apple CarPlay","Android Auto","360 Camera","Parking Sensors","Night Vision","Carbon Ceramic Brakes","Air Suspension","Active Exhaust","Sport Chrono","Launch Control","Track Mode","Autopilot","FSD Capability"];

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

function generateSlug(year: number, make: string, model: string, trim: string) {
  const base = `${year}-${make}-${model}-${trim}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return base;
}

function generateVIN() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let vin = "";
  for (let i = 0; i < 17; i++) vin += chars[Math.floor(Math.random() * chars.length)];
  return vin;
}

export const vehicles = brands.flatMap((brand, brandIndex) =>
  brand.models.map((m, modelIndex) => {
    const year = randInt(2020, 2024);
    const price = Math.round(m.priceBase * (0.92 + Math.random() * 0.12));
    const msrp = Math.round(price * m.msrpMult);
    const mileage = randInt(800, 32000);
    const stockNumber = `SK-${(brandIndex * 10 + modelIndex + 1001).toString()}`;
    const slugBase = generateSlug(year, brand.make, m.model, m.trim || "base");
    const slug = `${slugBase}-${brandIndex}-${modelIndex}`;
    const pool = brandImagePools[brand.make];
    const img1 = `https://images.unsplash.com/photo-${pool[(brandIndex * 20 + modelIndex * 2) % pool.length]}?w=800&q=80`;
    const img2 = `https://images.unsplash.com/photo-${pool[(brandIndex * 20 + modelIndex * 2 + 1) % pool.length]}?w=800&q=80`;
    const body = m.body;
    const doors = body === "Coupe" || body === "Convertible" ? randPick([2,2,2,4]) : body === "SUV" || body === "Truck" || body === "Wagon" ? 5 : 4;
    const seats = body === "Coupe" ? randPick([2,4,4]) : body === "Convertible" ? randPick([2,4,4]) : 5;
    const transmission = randPick(transmissions);
    const engine = randPick(engines);
    const fuelType = brand.make === "Tesla" ? "Electric" : randPick(fuelTypes.filter(f => f !== "Electric").concat(["Electric"]));
    const driveType = randPick(driveTypes);
    const exteriorColor = randPick(colors);
    const interiorColor = randPick(interiors);
    const features = randN(featuresPool, randInt(5, 10)).join(",");
    const status = Math.random() > 0.92 ? "sold" : Math.random() > 0.85 ? "pending" : "available";
    const featured = Math.random() > 0.82;

    return {
      slug,
      stockNumber,
      vin: generateVIN(),
      make: brand.make,
      model: m.model,
      trim: m.trim || null,
      year,
      price,
      msrp,
      mileage,
      bodyStyle: body,
      transmission,
      engine,
      fuelType,
      driveType,
      doors,
      seats,
      exteriorColor,
      interiorColor,
      description: `Immaculate ${year} ${brand.make} ${m.model}${m.trim ? ` ${m.trim}` : ""}. A stunning ${body.toLowerCase()} finished in ${exteriorColor} over ${interiorColor}. Meticulously maintained and ready for its next discerning owner.`,
      features,
      images: `${img1},${img2}`,
      status,
      featured,
    };
  })
);

async function main() {
  const adminPassword = process.env.ADMIN_PASSWORD || "admin@123";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  await prisma.adminUser.upsert({
    where: { email: "admin@skayautogroup.ca" },
    update: {},
    create: {
      email: "admin@skayautogroup.ca",
      password: hashedPassword,
    },
  });
  console.log(`[Seed] Admin user created/updated with email: admin@skayautogroup.ca`);

  // Clean existing vehicles and re-seed fresh inventory
  await prisma.vehicle.deleteMany({});

  for (const vehicle of vehicles) {
    await prisma.vehicle.create({ data: vehicle });
  }

  console.log(`Seeded ${vehicles.length} vehicles successfully`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
