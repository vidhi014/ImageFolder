export const darkTheme = {
    bg:"#15171E",
    bgLight: "#1C1E27",
    primary:"#be1adb",
    text_primary:"#F2F3F4",
    text_secondary:"#b1b2b3",
    card:"#121212",
    button:"#5c5b5b",
}

export const lightTheme = {
    bg:"#FFFFFF",
    bgLight: "#f0f0f0",
    primary:"#be1adb",
    text_primary:"#111111",
    text_secondary:"#48494a",
    card:"#FFFFFF",
    button:"#5c5b5b",
}


// const ComedyCard = ({ limit }) => {
//   const [podcasts, setPodcasts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const getallpodcasts = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`http://localhost:4000/api/card/category/filter?category=Comedy`);
//       const data = await res.json();
//       // Only take first N if limit is passed
//       setPodcasts(limit ? data.slice(0, limit) : data);
//     } catch (error) {
//       console.error("Error fetching business podcasts:", error);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     getallpodcasts();
//   }, [limit]);

//   return (
//     <>
//       {loading ? (
//         <CircularProgress />
//       ) : (
//         <Wrapper>
//           {podcasts.map((podcast) => (
//             <Card key={podcast._id}>
//               <div style={{width:"280px"}}>
//                 <Top>
//                   <Favourite>
//                     <FavoriteIcon style={{ width: "16px", height: "16px" }} />
//                   </Favourite>
//                   <CardImage src={podcast.image} alt={podcast.title} />
//                 </Top>
//                 <CardInformation>
//                   <MainInfo>
//                     <Title>{podcast.title}</Title>
//                     <Description>{podcast.description}</Description>
//                     <CreatersInfo>
//                       <Creator>
//                         <Avatar style={{ width: "23px", height: "23px" }}>
//                           {podcast.creatorName?.[0]}
//                         </Avatar>
//                         <CreatorName>{podcast.creatorName}</CreatorName>
//                       </Creator>
//                       <Views>{podcast.views} Views</Views>
//                     </CreatersInfo>
//                   </MainInfo>
//                 </CardInformation>
//               </div>
//               <Playicon>
//                 {podcast.mediaType === "video" ? (
//                   <PlayArrowIcon style={{ width: "28px", height: "28px" }} />
//                 ) : (
//                   <HeadphonesIcon style={{ width: "28px", height: "28px" }} />
//                 )}
//               </Playicon>
//             </Card>
//           ))}
//         </Wrapper>
//       )}
//     </>
//   );
// };

// export default ComedyCard;

