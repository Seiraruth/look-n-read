import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const AdminFormLoginSchema = z.object({
    email: z.string().email().min(1, { message: "Email is required" }),
    password: z.string().min(1, { message: "Password is required" }),
});

export function AdminFormLogin({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const navigate = useNavigate();
    const { adminLogin } = useAuth();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof AdminFormLoginSchema>>({
        resolver: zodResolver(AdminFormLoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleLogin = async (
        values: z.infer<typeof AdminFormLoginSchema>
    ) => {
        setError("");
        setIsLoading(true);
        try {
            await adminLogin(values.email, values.password);
            navigate("/admin/dashboard");
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error("Error: ", axiosError.response?.data);
            setError("Email atau password salah");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Welcome Administrator</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>

                    <div>
                        {error && (
                            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                                {error}
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleLogin)}>
                            <FieldGroup>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="johndoe@example.com"
                                                    autoComplete="off"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    placeholder="********"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Field>
                                    <div className="text-right">
                                        <Link
                                            to={"#"}
                                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                        >
                                            Forgot your password?
                                        </Link>
                                    </div>
                                </Field>
                                <Field>
                                    <Button type="submit">Login</Button>
                                </Field>
                            </FieldGroup>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
