'use client'

import { Question } from "@/models/question";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { remult } from "remult";
import PreviewForm from "./PreviewForm";

const questionRepo = remult.repo(Question);

const LaunchForm = ({ token }: any) => {
  const [question, setQuestion] = useState<Question>();


  useEffect(() => {
    if (token?.launch?.target) {
      const resourceid = (new URL(token?.launch?.target || ''))?.searchParams?.get?.('resourceid');
      if (resourceid) {
        questionRepo.findId(resourceid).then(setQuestion);
      }
    }
  }, [token?.launch?.target])

  console.log("question", question)

  return (
    <div>
      <PreviewForm loading={false} question={question} />
    </div>
  )
}

export default LaunchForm;