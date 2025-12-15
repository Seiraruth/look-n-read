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
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, X } from "lucide-react";
import { toast } from "sonner";

const formAddComicSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    slug: z
        .string()
        .min(1, { message: "Slug is required" })
        .regex(/^\S*$/, "Tidak boleh ada spasi"),
    author: z.string().min(1, { message: "Author is required" }),
    status: z.string().min(1, { message: "Status is required" }),
    type: z.string().min(1, { message: "Type is required" }),
    synopsis: z.string().min(1, { message: "Synopsis is required" }),
    cover: z.array(z.instanceof(File)).min(1, { message: "Cover is required" }),
});

const FormAddComic = () => {
    const navigate = useNavigate();
    const form = useForm<z.infer<typeof formAddComicSchema>>({
        resolver: zodResolver(formAddComicSchema),
        defaultValues: {
            title: "",
            slug: "",
            author: "",
            status: "",
            type: "",
            synopsis: "",
            cover: [],
        },
    });

    const handleAddComic = async (
        values: z.infer<typeof formAddComicSchema>
    ) => {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("slug", values.slug);
        formData.append("author", values.author);
        formData.append("type", values.type);
        formData.append("status", values.status);
        formData.append("synopsis", values.synopsis);
        values.cover.forEach((file) => {
            formData.append("cover_image", file);
        });
        try {
            const response = await axios.post(
                "/api/auth/admin/comics",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            toast.success(response.data.message, {
                position: "top-center",
                duration: 1500,
                style: {
                    "--normal-bg":
                        "light-dark(var(--color-green-600), var(--color-green-400))",
                    "--normal-text": "var(--color-white)",
                    "--normal-border":
                        "light-dark(var(--color-green-600), var(--color-green-400))",
                } as React.CSSProperties,
            });
            console.log("Success: ", response.data);
            form.reset();
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error("Error: ", axiosError.response?.data);
        }
    };

    return (
        <AdminLayout>
            <div className="w-full space-y-6 my-8 mx-auto max-w-full">
                {/* Main Card */}
                <Card className="pb-0 gap-0 mx-6 md:mx-8">
                    <CardHeader className="border-b border-border gap-0">
                        <div className="flex gap-10  items-end">
                            <Link to={"/admin/dashboard"}>
                                <ChevronLeft className="size-8 text-primary hover:text-primary/60 transition-all duration-300" />
                            </Link>
                            <h1 className="text-primary text-4xl font-bold capitalize">
                                Add comic
                            </h1>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
                            <Form {...form}>
                                <form
                                    className="flex flex-col w-full"
                                    onSubmit={form.handleSubmit(handleAddComic)}
                                >
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Example: One Piece, Solo Leveling, Magic Emperor, etc."
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="slug"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Slug</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Example: one-piece, dragon-ball, solo-leveling, etc."
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="author"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Author</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        {...field}
                                                        placeholder="Example: Eiichiro Oda, Akutami Gege, etc."
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    {/* Select Type Comic */}
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="mt-3">
                                                    Type
                                                </FormLabel>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full mt-3">
                                                            <SelectValue placeholder="Type Comic" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>
                                                                Type
                                                            </SelectLabel>
                                                            <SelectItem value="manga">
                                                                Manga
                                                            </SelectItem>
                                                            <SelectItem value="manhua">
                                                                Manhua
                                                            </SelectItem>
                                                            <SelectItem value="manhwa">
                                                                Manhwa
                                                            </SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {/* Select Status Comic */}
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="mt-3">
                                                    Status
                                                </FormLabel>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full mt-3">
                                                            <SelectValue placeholder="Status Comic" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>
                                                                Status
                                                            </SelectLabel>
                                                            <SelectItem value="ongoing">
                                                                Ongoing
                                                            </SelectItem>
                                                            <SelectItem value="completed">
                                                                Completed
                                                            </SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="synopsis"
                                        render={({ field }) => (
                                            <FormItem className="mt-5">
                                                <FormLabel htmlFor="synopsis">
                                                    Synopsis
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        id="synopsis"
                                                        {...field}
                                                        className="mt-3"
                                                        placeholder="Write Synopsis here etc..."
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="cover"
                                        render={({ field }) => (
                                            <FormItem className="mt-3">
                                                <FormLabel>
                                                    Upload Cover
                                                </FormLabel>
                                                <FileUploadDemo
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="mt-10 flex gap-5">
                                        <Button
                                            className="w-full"
                                            type="submit"
                                        >
                                            Add Comic
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                navigate("/admin/dashboard")
                                            }
                                            type="reset"
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

export default FormAddComic;
