'use client'

import { Question } from "@/models/question";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { remult } from "remult";
import PreviewForm from "./PreviewForm";
import { Resource } from "@/models/resource";

const resourceRepo = remult.repo(Resource);

const LaunchForm = ({ token }: any) => {
  // const [question, setQuestion] = useState<Question>();
  const [resource, setResource] = useState<Resource>();
  const [loading, setLoading] = useState<boolean>(false);
  const [sectionForm, setSectionForm] = useState();
  const [step, setStep] = useState(0);
  const [questionMap, setQuestionMap] = useState<Record<string, number>>({});
  const [submitExercise, setSubmitExercise] = useState<Record<string, boolean>>({});


  useEffect(() => {
    if (token?.launch?.target) {
      const resourceid = (new URL(token?.launch?.target || ''))?.searchParams?.get?.('resourceid');
      console.log("resourceid", resourceid)
      if (resourceid) {
        setLoading(true)
        resourceRepo.findId(resourceid, {
          include: {
            sections: true,
          },
        }).then((resource => {
          setResource(resource);
          setStep(1);
          const questionMap: Record<string, number> = {};
          resource?.sections?.map((section, index) => {
            questionMap[section?.id] = 0;
          });
          setQuestionMap(questionMap);
        })).finally(() => setLoading(false))
      }
    }
  }, [token?.launch?.target])

  console.log("question", resource)
  console.log("token", token)

  return (
    <div>
      <PreviewForm setQuestionMap={setQuestionMap} questionMap={questionMap} setSubmitExercise={setSubmitExercise} submitExercise={submitExercise} token={token} loading={loading} resource={resource} />
    </div>
  )
}

export default LaunchForm;