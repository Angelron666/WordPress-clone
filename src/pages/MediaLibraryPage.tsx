import React, { useState, useRef, ChangeEvent } from 'react';
import { useApi } from '../context/ApiContext';
import { Media } from '../types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Upload, Trash2, Edit, Image as ImageIcon, File, FileAudio, FileVideo } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// File upload schema
const uploadSchema = z.object({
  file: z.instanceof(File).refine(file => file.size > 0, {
    message: "Please select a file",
  }),
  title: z.string().min(1, "Title is required"),
  alt: z.string().optional(),
  description: z.string().optional(),
});

// Edit media schema
const editMediaSchema = z.object({
  title: z.string().min(1, "Title is required"),
  alt: z.string().optional(),
  description: z.string().optional(),
});

const MediaLibraryPage: React.FC = () => {
  const { media, loading, createMedia, deleteMedia, updateMedia } = useApi();
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form for uploading media
  const uploadForm = useForm<z.infer<typeof uploadSchema>>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: '',
      alt: '',
      description: '',
    },
  });

  // Form for editing media
  const editForm = useForm<z.infer<typeof editMediaSchema>>({
    resolver: zodResolver(editMediaSchema),
    defaultValues: {
      title: '',
      alt: '',
      description: '',
    },
  });

  // Set form values when selectedMedia changes
  React.useEffect(() => {
    if (selectedMedia) {
      editForm.reset({
        title: selectedMedia.title,
        alt: selectedMedia.alt || '',
        description: selectedMedia.description || '',
      });
    }
  }, [selectedMedia, editForm]);

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Auto-fill title from filename
      const fileName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      uploadForm.setValue('title', fileName);
      uploadForm.setValue('file', file);
    }
  };

  // Handle file upload
  const handleUpload = async (data: z.infer<typeof uploadSchema>) => {
    if (!data.file) return;

    setUploading(true);
    try {
      // Create a URL for the file
      const url = URL.createObjectURL(data.file);
      
      // Determine file type
      let fileType: 'image' | 'video' | 'audio' | 'document' = 'document';
      if (data.file.type.startsWith('image/')) fileType = 'image';
      else if (data.file.type.startsWith('video/')) fileType = 'video';
      else if (data.file.type.startsWith('audio/')) fileType = 'audio';
      
      // Get dimensions if it's an image
      let dimensions;
      if (fileType === 'image') {
        dimensions = await getImageDimensions(data.file);
      }

      // Create media
      await createMedia({
        title: data.title,
        url,
        alt: data.alt,
        description: data.description,
        type: fileType,
        size: data.file.size,
        dimensions,
      });
      
      // Reset form
      uploadForm.reset();
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  // Handle media update
  const handleUpdateMedia = async (data: z.infer<typeof editMediaSchema>) => {
    if (!selectedMedia) return;

    try {
      await updateMedia(selectedMedia.id, {
        title: data.title,
        alt: data.alt,
        description: data.description,
      });
      
      setSelectedMedia(null);
    } catch (error) {
      console.error('Error updating media:', error);
    }
  };

  // Handle media deletion
  const handleDeleteMedia = async (id: string) => {
    try {
      await deleteMedia(id);
      if (selectedMedia?.id === id) {
        setSelectedMedia(null);
      }
    } catch (error) {
      console.error('Error deleting media:', error);
    }
  };

  // Get image dimensions
  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
        URL.revokeObjectURL(img.src); // Clean up
      };
      img.src = URL.createObjectURL(file);
    });
  };

  // Filter media by type and search term
  const filteredMedia = media.filter(item => {
    const matchesTab = selectedTab === 'all' || item.type === selectedTab;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    return matchesTab && matchesSearch;
  });

  // Helper to render the appropriate icon based on media type
  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-6 w-6" />;
      case 'video':
        return <FileVideo className="h-6 w-6" />;
      case 'audio':
        return <FileAudio className="h-6 w-6" />;
      default:
        return <File className="h-6 w-6" />;
    }
  };

  // Helper to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Media Library</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-wordpress-blue hover:bg-blue-700">
              <Upload className="mr-2 h-4 w-4" /> Add New
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Upload New Media</DialogTitle>
            </DialogHeader>
            <Form {...uploadForm}>
              <form onSubmit={uploadForm.handleSubmit(handleUpload)} className="space-y-4">
                <FormField
                  control={uploadForm.control}
                  name="file"
                  render={({ field: { onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>File</FormLabel>
                      <FormControl>
                        <Input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={(e) => {
                            handleFileChange(e);
                            onChange(e.target.files?.[0]);
                          }}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={uploadForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={uploadForm.control}
                  name="alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alt Text</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={uploadForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-wordpress-blue hover:bg-blue-700"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                    </>
                  ) : (
                    'Upload'
                  )}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search media..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">All ({media.length})</TabsTrigger>
          <TabsTrigger value="image">Images ({media.filter(item => item.type === 'image').length})</TabsTrigger>
          <TabsTrigger value="video">Videos ({media.filter(item => item.type === 'video').length})</TabsTrigger>
          <TabsTrigger value="audio">Audio ({media.filter(item => item.type === 'audio').length})</TabsTrigger>
          <TabsTrigger value="document">Documents ({media.filter(item => item.type === 'document').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {renderMediaGrid(filteredMedia)}
        </TabsContent>
        <TabsContent value="image" className="mt-6">
          {renderMediaGrid(filteredMedia)}
        </TabsContent>
        <TabsContent value="video" className="mt-6">
          {renderMediaGrid(filteredMedia)}
        </TabsContent>
        <TabsContent value="audio" className="mt-6">
          {renderMediaGrid(filteredMedia)}
        </TabsContent>
        <TabsContent value="document" className="mt-6">
          {renderMediaGrid(filteredMedia)}
        </TabsContent>
      </Tabs>

      {/* Dialog for editing media */}
      {selectedMedia && (
        <Dialog open={!!selectedMedia} onOpenChange={(open) => !open && setSelectedMedia(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Media</DialogTitle>
            </DialogHeader>
            <div className="mb-4">
              {selectedMedia.type === 'image' ? (
                <img 
                  src={selectedMedia.url} 
                  alt={selectedMedia.alt || selectedMedia.title} 
                  className="max-h-60 mx-auto object-contain"
                />
              ) : (
                <div className="bg-gray-100 p-8 rounded-md flex items-center justify-center">
                  {getMediaIcon(selectedMedia.type)}
                </div>
              )}
            </div>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleUpdateMedia)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alt Text</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the media item.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteMedia(selectedMedia.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button type="submit" className="bg-wordpress-blue hover:bg-blue-700">
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );

  // Helper function to render the media grid
  function renderMediaGrid(mediaItems: Media[]) {
    if (loading.media) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    if (mediaItems.length === 0) {
      return (
        <div className="text-center p-12 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-500">No media items found</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mediaItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader className="p-0">
              {item.type === 'image' ? (
                <div className="h-40 overflow-hidden bg-gray-100">
                  <img 
                    src={item.url} 
                    alt={item.alt || item.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-40 bg-gray-100 flex items-center justify-center">
                  {getMediaIcon(item.type)}
                </div>
              )}
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-sm font-medium truncate">{item.title}</CardTitle>
              <CardDescription className="text-xs mt-1">
                {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                <span className="block mt-1">{formatFileSize(item.size)}</span>
              </CardDescription>
            </CardContent>
            <CardFooter className="p-2 bg-gray-50">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs w-full"
                onClick={() => setSelectedMedia(item)}
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
};

export default MediaLibraryPage;