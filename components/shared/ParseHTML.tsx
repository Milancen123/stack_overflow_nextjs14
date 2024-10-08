"use client";
import React, { useEffect } from "react";
import Prism from "prismjs";
import parse from "html-react-parser";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-aspnet";
import "prismjs/components/prism-sass";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-solidity";
import "prismjs/components/prism-json";
import "prismjs/components/prism-dart";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-r";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-go";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-mongodb";
import "prismjs/plugins/line-numbers/prism-line-numbers.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

interface Props {
  data: string;
}
//flex flex-col flex-wrap text-sm sm:text-base max-sm:max-w-[320px]  max-sm:overflow-x-scroll
const ParseHTML = ({ data }: Props) => {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <div className="text-dark300_light700 overflow-hidden max-w-full max-sm:max-w-[310px] sm:max-w-[400px] lg:max-w-full">
      {parse(data)}
    </div>
  );
};

export default ParseHTML;
