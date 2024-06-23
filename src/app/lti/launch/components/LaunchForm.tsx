'use client'

import { Question } from "@/models/question";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { remult } from "remult";
import PreviewForm from "./PreviewForm";

const questionRepo = remult.repo(Question);

const LaunchForm = () => {
  const [question, setQuestion] = useState<Question>();
  const clientSearchParams = useSearchParams();

  console.log("clientSearchParams", clientSearchParams.get("resourceid"));
  const resourceid = clientSearchParams.get("resourceid");

  useEffect(() => {
    if (resourceid) {
      questionRepo.findId(resourceid).then(setQuestion);
    }
  }, [resourceid])

  console.log("question", question)

  return (
    <div>
      <PreviewForm loading={false} question={question} />
    </div>
  )
}

export default LaunchForm;