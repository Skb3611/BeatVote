import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { toast } from "@workspace/ui/components/sonner";

    

interface AddSongProps {
  onAddSong: (songData: { url: string; title: string }) => void;
}

const AddSong = ({ onAddSong }: AddSongProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
 const [form, setform] = useState<{url: string, title: string}>({
    url: "",
    title: "",
 })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!form.url.includes("youtube.com") && !form.url.includes("youtu.be")) {
      toast.error("Please enter a valid YouTube URL")
      return;
    }

    onAddSong({
      url: form.url,  
      title: form.title || "Untitled Song",
    });
    
    setform({
        url: "",
        title: "",
    })
    setIsExpanded(false);
    
    toast.success("Song added!")
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a Song</CardTitle>
      </CardHeader>
      <CardContent>
        {!isExpanded ? (
          <Button 
            className="w-full bg-music-primary hover:bg-music-secondary button-hover"
            onClick={() => setIsExpanded(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add a YouTube Song
          </Button>
        ) : (

            <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
             <div>
                <Input 
                    placeholder="YouTube URL (https://www.youtube.com/watch?v=...)" 
                    value={form.url}
                    onChange={(e) => setform({...form, url: e.target.value})}
                    autoFocus
                  />
             </div>
             <div>
                <Input 
                    placeholder="Song title (optional)" 
                    value={form.title}
                    onChange={(e) => setform({...form, title: e.target.value})}
                  />
             </div>
              
              
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsExpanded(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-music-primary hover:bg-music-secondary"
                >
                  Add Song
                </Button>
              </div>
            </form>
        )}
      </CardContent>
    </Card>
  );
};

export default AddSong;