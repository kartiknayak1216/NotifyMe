import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendMail } from "./lib/mailclient";
import { DiscordClient } from "./lib/discordcliemt";
import { handleApiError } from "./lib/server";

const payloadSchema= z.object({
    category:z.string().nonempty("Category is required"),
    type:z.enum(["Discord","Email"],{
        errorMap: () => ({ message: "Type must be 'Discord' or 'Email'" }) }),
        targetId: z.string().nonempty("TargetId is required"),
        data:z.object({
            message: z.string().nonempty("message is required"),
            metadata:z.record(z.string(),z.any()).optional()
        })


    
})

export const POST = async(req:NextRequest)=>{
try{
const autheader = req.headers.get("Authorization")

if(!autheader){
return NextResponse.json({message:"Unauthorized"},{status:401})
}
   

if(!autheader.startsWith("Bearer ")){
return NextResponse.json({
    message: "Invalid auth header format. Expected: 'Bearer [API_KEY]'",

},{
    status:401
})
}

const apiKey = autheader.split(" ")[1]

if(!apiKey || apiKey.trim()===""){
    return NextResponse.json({ message: "Secreat Key Notfound" }, { status: 401 })
 
}


const isUser= await prisma.user.findUnique({
    where:{
        secretKey:apiKey
    },
    include:{
        group:{
            select:{
                name:true,
                icon:true,
                id:true
            }
        }
    }
})
if(!isUser){
    return NextResponse.json({ message: "Invalid API key" }, { status: 401 })
}
    const currentData = new Date()
    const currentMonth = currentData.getMonth() + 1
    const currentYear = currentData.getFullYear()


const userQuota= await prisma.quota.findUnique({
    where:{
        userId_year_month: {
            userId: isUser.id,
            month: currentMonth,
            year: currentYear,
        },
    }
})
//marking failure update

const quotalimit = isUser.plan==="FREE"?10:100

if(userQuota && userQuota.count>quotalimit){
    return NextResponse.json(
        {
            message:
                "Monthly quota reached. Please upgrade your plan for more events",
        },
        { status: 429 }
    )
}

    let requestData: unknown
    let validatedPayload

    try {
        requestData = await req.json()
    } catch (err) {
        return NextResponse.json(
            {
                message: "Invalid JSON request body",
            },
            { status: 400 }
        )
    }


try{
    validatedPayload = payloadSchema.parse(requestData);
console.log(validatedPayload)
}catch(error){
    if (error instanceof z.ZodError) {
        return NextResponse.json(
            {
                message: "Validation error",
                errors: error.errors, 
            },
            { status: 400 }
        );

    }
    else{
        return NextResponse.json({ status:400 })

    }
}

    const category = isUser.group.find((droup) => droup.name === validatedPayload.category)

   


    if (!category) {
        return NextResponse.json(
            {
                message: `You dont have a category named "${validatedPayload.category}"`,
            },
            { status: 404 }
        )
    }

   
    if(validatedPayload.type==="Email"){
       try{
           const res = await sendMail({
               sendTo: validatedPayload.targetId,
               subject: `NotifyMe for ${category.icon!} ${validatedPayload.category}`,
               text: "hi ",
               html:`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta content="summary_large_image" name="twitter:card" />
    <meta content="website" property="og:type" />
    <meta content="https://tjkumcc1dp.preview-beefreedesign.com/AHj8" property="og:url" />
    <meta content="https://pro-bee-beepro-thumbnail.getbee.io/messages/1324074/1310368/2322814/12164993_large.jpg" property="og:image" />
    <meta content="Notification from NotifyMe!" property="og:title" />
    <meta content="Stay updated with the latest notifications." name="description" />
    <title>Notification from NotifyMe</title>

    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet">

    <style>
        /* Global styles */
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: Oswald, Arial, Helvetica Neue, Helvetica, sans-serif;
            color: #000;
            background-color: #fff; /* White background added */
            line-height: 1.6;
        }

        /* Container and row styling */
        .bee-row {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .bee-row-content {
            width: 100%;
            max-width: 1280px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .bee-col {
            flex: 1;
            padding: 10px;
        }

        /* Header styling */
        .bee-header {
            text-align: center;
            background-color: #fff;
            padding: 30px 0;
        }

        .bee-header img {
            max-width: 180px;
            margin-bottom: 20px;
        }

        /* Section styling */
        .bee-section {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            margin-bottom: 30px;
        }

        .bee-heading h3 {
            font-size: 28px;
            font-weight: bold;
            color: #186af5;
            margin-bottom: 15px;
            text-align: center;
        }

        .bee-paragraph p {
            font-size: 16px;
            color: #333;
            margin-bottom: 10px;
            text-align: left;
        }

        .bee-paragraph strong {
            color: #0059c7;
        }

        /* Footer styling */
        .bee-footer {
            text-align: center;
            background-color: #0059c7;
            color: #fff;
            padding: 20px;
        }

        .bee-footer img {
            max-height: 32px;
        }

        /* Spacer */
        .spacer {
            height: 25px;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
            .bee-header img {
                max-width: 150px;
            }

            .bee-heading h3 {
                font-size: 24px;
            }

            .bee-section {
                padding: 20px;
            }
        }
    </style>
</head>

<body>
    <!-- Header Section -->
    <div class="bee-row">
        <div class="bee-row-content">
            <div class="bee-col bee-header">
                <a href="http://www.example.com" target="_blank">
                    <img src="https://691c266617.imgdist.com/pub/bfra/605xvt73/v2m/720/sds/Screenshot%202025-01-04%20232556.png" alt="Logo">
                </a>
            </div>
        </div>
    </div>

    <!-- Notification Content Section -->
    <div class="bee-row">
        <div class="bee-row-content">
            <div class="bee-col bee-section">
                <div class="bee-heading">
                    <h3><strong>NOTIFICATION FROM </strong><span style="color: #186af5;">NOTIFYME!</span></h3>
                </div>
                <div class="bee-paragraph">
                    <p><strong>Group Name:</strong>${validatedPayload.category}</p>
                    <p><strong>Message:</strong>${validatedPayload.data.message}</p>
                </div>
                <div class="bee-paragraph">
<p><strong>Metadata:</strong>
  ${
                   validatedPayload.data.metadata && Object.keys(validatedPayload.data.metadata).length > 0
                       ? `<ul>${Object.entries(validatedPayload.data.metadata).map(([key, value]) => `
        <li><strong>${key}:</strong> ${String(value)}</li>
      `).join('')}</ul>`
        : "No metadata available."
  }
</p>

                       : ""
  }
</p>                </div>
            </div>

            <div class="bee-col bee-section">
                <img src="https://691c266617.imgdist.com/pub/bfra/605xvt73/1x5/hk2/ppv/Screenshot%202025-01-04%20233400.png" alt="Image" style="max-width: 100%;">
            </div>
        </div>
    </div>

    <!-- Footer Section -->
    <div class="bee-footer">
        <div class="bee-icon">
            <img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/8026/icon-app.png" alt="App Icon">
        </div>
    </div>
</body>

</html>
`
           })

           if (res.status === 200) {
               await prisma.$transaction(async (prisma) => {
                   await prisma.event.create({
                       data: {
                           groupId: category.id,
                           isSuccess: true,
                       },
                   });

                   await prisma.quota.upsert({
                       where: {
                           userId_year_month: {
                               userId: isUser.id,
                               year: currentYear,
                               month: currentMonth,
                           },
                       },
                       update: {
                           count: { increment: 1 },
                       },
                       create: {
                           userId: isUser.id,
                           year: currentYear,
                           month: currentMonth,
                           count: 1,
                       },
                   });
               });
               return NextResponse.json({ ststus: 200 })

           }
           else {
               await handleApiError(category.id,isUser.id,currentYear,currentMonth)

               return NextResponse.json({ message: res.message }, { status: res.status })

           }
       }catch(error){
           await handleApiError(category.id, isUser.id, currentYear, currentMonth)
        return NextResponse.json({ststus:500})
       }
    }

    if(validatedPayload.type==="Discord"){
        try{
            const discord = new DiscordClient(process.env.DISCORD_BOT_TOKEN)

            const dmChannel = await discord.createDM(validatedPayload.targetId)
            const payloadSchema = z.object({
                category: z.string().nonempty("Category is required"),
                type: z.enum(["Discord", "Email"], {
                    errorMap: () => ({ message: "Type must be 'Discord' or 'Email'" }),
                }),
                targetId: z.string().nonempty("TargetId is required"),
                data: z.object({
                    message: z.string().nonempty("Message is required"),
                    metadata: z.record(z.string(), z.any()).optional(),
                }),
            });

            const eventData = {
                title: `${category.icon || '🔔'} ${category.name}`,
                description:
                    validatedPayload.data.message ||
                    `A new ${category.name} event has occurred!`,
                timestamp: new Date().toISOString(),
                fields: Object.entries(validatedPayload.data.metadata ||{}).map(([key, value])=>({
                    name: key,
                    value: String(value),
                    inline: true,
            }))
            };


            await discord.sendEmbed(dmChannel.id, eventData)

            await prisma.$transaction(async (prisma) => {
                await prisma.event.create({
                    data: {
                        groupId: category.id,
                        isSuccess: true,
                    },
                });

                await prisma.quota.upsert({
                    where: {
                        userId_year_month: {
                            userId: isUser.id,
                            year: currentYear,
                            month: currentMonth,
                        },
                    },
                    update: {
                        count: { increment: 1 },
                    },
                    create: {
                        userId: isUser.id,
                        year: currentYear,
                        month: currentMonth,
                        count: 1,
                    },
                });
            });
            return NextResponse.json({ ststus: 200 })

        }catch(error){

            await handleApiError(category.id, isUser.id, currentYear, currentMonth)
            return NextResponse.json({ ststus: 500 })

        }
    }



}catch(error){
    return NextResponse.json({status:500})
}
}
