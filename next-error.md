[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Gestion des erreurs globales

NextJS offre la possibilité via un composant réservé **error.tsx** de gérer les erreurs locales et globales de manière simple. 

Si un composant nommé **error.tsx** est inséré au niveau d'une page, alors dès qu'une erreur non gérée sera levée dans cette page, le composant error.tsx sera présenté.

Pour gérer ces erreurs au niveau global, il suffit de créer un composant **error.tsx** au niveau le plus haut dans l'application.

Voici un exemple de composant, placé au même niveau que le layout principal 

*error.tsx*
````typescript
"use client";
import { ErrorContent } from "../../../components/error/ErrorContent";

export default function ErrorBoundary({ error, reset }: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorContent error={error} />;
}
````

*ErrorContent.tsx*
````typescript
import { LogErrorLevel, logUncatchedErrorToAPI } from "@/helpers/core/errorHelper.service";
import React from "react";


export const ErrorContent = ({
  error,
}: {
  error: Error & { digest?: string };
}) => {
  logUncatchedErrorToAPI({
    level: LogErrorLevel.Critical,
    fileName: error?.name ?? 'Exception',
    lineNumber: 0,
    message: error?.message ?? 'An error occured',
  });
  return (
    <div
      style={{
        padding: "50px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>Une erreur est survenue !</h1>
      {error && (
        <p
          style={{
            whiteSpace: "pre-wrap",
            padding: "20px",
            marginTop: "30px",
          }}
        >
          Erreur : {error.message}
        </p>
      )}
    </div>
  );
};
````


*ErrorHelperService.ts*
````typescript

export enum LogErrorLevel {
  Trace = 0,
  Debug = 1,
  Information = 2,
  Warning = 3,
  Error = 4,
  Critical = 5
}

type LogObject = {
  functionName: string,
  content: any
}

type UncatchedErrorObj = {
  level?: number,
  fileName: string | undefined,
  lineNumber?: number,
  message: string | Event | undefined
}
type LogObj = UncatchedErrorObj & { timestamp?: Date | string } 
  
export const logUncatchedErrorToAPI = (logObj: UncatchedErrorObj) => {
  
  try {
    const currentTimestamp = new Date();

    const errorObj: LogObj = {
      level: logObj.level ?? LogErrorLevel.Critical,
      fileName: `Frontend - ${logObj.fileName}`,
      lineNumber: logObj.lineNumber ?? 0,
      message: `[${currentTimestamp.toISOString()}] --> ${logObj.message}`,
      //timestamp: currentTimestamp.toISOString()
    }

    fetch(<error-api-url>), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: errorObj
      }),
    });
  } catch (e) {
    logError({ functionName: 'logUncatchedErrorToAPI', content: e})
  }
};

export const logError = (errorObj: LogObject, logLevel: LogErrorLevel = 4) => {
  const title = getLogErrorTitle(logLevel);
  console.log(`${title} ${errorObj.functionName} : ${JSON.stringify(errorObj)}`);
}

const getLogErrorTitle = (logLevel: LogErrorLevel): string => {  
  switch (logLevel) {
    case 0:
      return "[logTrace]";
    case 1:
      return "[logDebug]";
    case 2:
      return "[logInfo]";
    case 3:
      return "[logWarning]";
    default:
      return "[logError]";
  }
}
````
