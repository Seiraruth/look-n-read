import { IChildren, IComicChapter } from "@/types/index.type";
import Snowfall from "react-snowfall";
import customSnowflake from "/public/assets/images/snowflake.png";
import { Navbar } from "./Navbar";
import axios from "axios";
import { useContext, useState } from "react";
import { Context } from "@/context/Context";

const image = document.createElement("img");
image.src = customSnowflake;

const images = [image, image];

const GuestLayout = ({ children }: IChildren) => {
    return (
        <>
            <div className="min-h-screen dark:bg-neutral-950 dark:text-neutral-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
                <Snowfall
                    snowflakeCount={200}
                    speed={[0.5, 3]}
                    wind={[-0.5, 2]}
                    color="#00bcd4"
                    radius={[5, 20]}
                    rotationSpeed={[-1, 1]}
                    opacity={[0.5, 1]}
                    style={{
                        position: "fixed",
                        width: "100vw",
                        height: "100vh",
                        zIndex: "revert",
                    }}
                    images={images}
                />
            </div>
        </>
    );
};

export default GuestLayout;
