import { config } from "../config"
export const getDuration = async (url:string):Promise<number> => {
  try{
    const videoId = extractVideoId(url)
    if (!videoId) {
      return 0;
    }

    const endpoint =`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${config.ytApiKey}`
    // console.log(endpoint)
    const response = await fetch(endpoint)
    const data = await response.json()
    
    if (!data.items || data.items.length === 0) {
      return 0;
    }
    
    const duration = data.items[0].contentDetails.duration
    // Convert ISO 8601 duration to seconds
    return parseDuration(duration);
  }catch(e){
    console.log(e)
    return 0
  }
}

// Helper function to parse ISO 8601 duration to seconds
const parseDuration = (duration: string): number => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) {
    return 0;
  }
  
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  
  return hours * 3600 + minutes * 60 + seconds;
}

const extractVideoId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url?.match(regExp);
  return (match && match?.[2]?.length === 11) ? match?.[2] : null;
}