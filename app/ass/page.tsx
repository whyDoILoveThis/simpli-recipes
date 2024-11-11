"use client";
import ObjectDetection from "@/components/AI/ObjectDetection";
import OcrUpload from "@/components/AI/OCRUpload";
import ChevronsUpDown from "@/components/icons/ChevronsUpDown";
import { Button } from "@/components/ui/button";
import ItsDropdown from "@/components/ui/its-dropdown";
import TransitionX from "@/components/ui/TransitionX";
import React from "react";
import { BsThreeDots } from "react-icons/bs";

const page = () => {
  return (
    <div className="pt-20">
      {/* <TransitionX /> */}

      {/* <ObjectDetection /> */}
      <div>
        <h1 className="text-4xl text-center my-4">OCR Text Recognition App</h1>
        <OcrUpload />
      </div>

      {/* <ItsDropdown
        theButton={
          <Button className="p-0 w-[30px] h-[30px]">
            <BsThreeDots className="text-slate-400" />
          </Button>
        }
      >
        <ItsDropdown
          theButton={
            <button className="flex gap-1 items-center">
              Category
              <span className="text-slate-500">
                <ChevronsUpDown />
              </span>
            </button>
          }
        >
          <li>quick</li>
          <li>slow</li>
          <li>old</li>
          <li>new</li>
        </ItsDropdown>
        <ItsDropdown
          theButton={
            <button className="flex gap-1 items-center">
              Sort Order
              <span className="text-slate-500">
                <ChevronsUpDown />
              </span>
            </button>
          }
        >
          <li>breakfase</li>
          <li>Lunch</li>
          <li>dinner</li>
          <li>snack</li>
        </ItsDropdown>
      </ItsDropdown> */}
    </div>
  );
};

export default page;
