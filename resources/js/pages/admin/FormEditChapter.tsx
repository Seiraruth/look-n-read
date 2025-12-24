import { FileUploadDemo } from "@/components/admin-comp/FileUploadDemo";
import AdminLayout from "@/components/layouts/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import { getApi } from "@/services/api";

// Schema Validation
const formAddComicSchema = z.object({
    comic_id: z.number(),
    title: z.string().optional(),
    slug: z
        .string()
        .min(1, { message: "Slug is required" })
        .regex(/^\S*$/, "Tidak boleh ada spasi")
        .optional()
        .or(z.literal("")), // Allow empty string agar optional bekerja saat coerce
    // Gunakan coerce agar input string angka ("10") otomatis jadi number (10)
    chapNum: z.coerce.number().min(0.1, { message: "Number is required" }),
    pages: z.array(z.instanceof(File)).optional(),
});

// Type Inference (Opsional, buat bantuan autocomplete kalau butuh)
type FormSchema = z.infer<typeof formAddComicSchema>;

interface IComic {
    title?: string;
}

const FormEditChapter = () => {
    const { slug, id } = useParams();
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [comic, setComic] = useState<IComic>();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(formAddComicSchema),
        defaultValues: {
            comic_id: 0,
            title: "",
            slug: "",
            chapNum: 0,
            pages: [],
        },
    });

    const handleUpdateChapter = async (values: FormSchema) => {
        setIsLoading(true);
        const formData = new FormData();

        formData.append("_method", "PUT");
        formData.append("comic_id", values.comic_id.toString());
        formData.append("number", values.chapNum.toString());

        if (values.title) formData.append("title", values.title);
        if (values.slug) formData.append("slug", values.slug);

        // Loop array pages[]
        if (values.pages && values.pages.length > 0) {
            values.pages.forEach((file) => {
                formData.append("pages[]", file);
            });
        }

        try {
            const response = await axios.post(
                `/api/auth/admin/chapters/${id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Chapter uploaded successfully!");
            console.log("Success: ", response.data);
            fetchData();
            form.reset();
            navigate(`/admin/comics/${slug}`);
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error("Error: ", axiosError.response?.data);
            if (axiosError.response?.status === 422) {
                toast.error("Validasi Gagal. Cek inputan.");
            } else {
                toast.error("Terjadi kesalahan server.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const fetchData = useCallback(async () => {
        if (!id) return;
        // 2. Set comic_id ke form state agar tidak bernilai 0 saat submit
        form.setValue("comic_id", parseInt(id));
        try {
            const response = await getApi(`chapters/${id}`);
            const data = response?.data.data;
            setComic(data.comic);

            form.reset({
                comic_id: data.comic_id,
                chapNum: parseFloat(data.number),
                title: data.title || "",
                slug: data.slug || "",
                pages: [],
            });
        } catch (error) {
            console.error(error);
            toast.error("Gagal mengambil data chapter");
        }
    }, [slug, form]);
    // Load Comic Data & Set Comic ID
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <AdminLayout>
            <div className="w-full space-y-6 my-8 mx-auto max-w-full">
                {/* Main Card */}
                <Card className="pb-0 gap-0 mx-6 md:mx-8">
                    <CardHeader className="border-b border-border gap-0">
                        <div className="flex gap-10 items-center">
                            <Link to={`/admin/comics/${slug}`}>
                                <ChevronLeft className="size-8 text-primary hover:text-primary/60 transition-all duration-300" />
                            </Link>
                            <div className="flex flex-col">
                                <h1 className="text-primary text-4xl font-bold capitalize">
                                    Update Chapter
                                </h1>
                                <h3 className="text-primary/70 text-xl font-medium capitalize mt-1">
                                    Comic Name : {comic?.title || "Loading..."}
                                </h3>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
                            <Form {...form}>
                                <form
                                    className="flex flex-col w-full space-y-4"
                                    onSubmit={form.handleSubmit(
                                        handleUpdateChapter
                                    )}
                                >
                                    {/* HIDDEN INPUT FOR COMIC ID */}
                                    <FormField
                                        control={form.control}
                                        name="comic_id"
                                        render={({ field }) => (
                                            <FormItem className="hidden">
                                                <FormControl>
                                                    <Input
                                                        type="hidden"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* CHAPTER NUMBER */}
                                        <FormField
                                            control={form.control}
                                            name="chapNum"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel>
                                                        Chapter Number
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            step="0.1"
                                                            placeholder="Example: 1, 10.5"
                                                            {...field}
                                                            value={
                                                                field.value as
                                                                    | string
                                                                    | number
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* TITLE */}
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel>
                                                        Title (Optional)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="text"
                                                            placeholder="Example: The Beginning"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* SLUG */}
                                    <FormField
                                        control={form.control}
                                        name="slug"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>
                                                    Slug (Optional)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Example: chapter-01"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* PAGES UPLOAD */}
                                    <FormField
                                        control={form.control}
                                        name="pages"
                                        render={({ field }) => (
                                            <FormItem className="mt-3">
                                                <FormLabel>
                                                    Chapter Pages
                                                </FormLabel>
                                                <FormControl>
                                                    <FileUploadDemo
                                                        value={field.value}
                                                        onChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Upload images for this
                                                    chapter.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* BUTTONS */}
                                    <div className="mt-10 flex gap-5">
                                        <Button
                                            className="w-full"
                                            type="submit"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                                    Uploading...
                                                </>
                                            ) : (
                                                "Add Chapter"
                                            )}
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                navigate(
                                                    `/admin/comics/${slug}`
                                                )
                                            }
                                            type="button"
                                            variant={"outline"}
                                            className="w-full"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default FormEditChapter;
