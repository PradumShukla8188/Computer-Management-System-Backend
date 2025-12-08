import { templatesSlug } from "src/constants/enum"

const templates = [
    {
        uid: templatesSlug.WelcomeToPlatform,
        subject: `Welcome to {{project}}`,
        html: `<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>One Day Left</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;400;500;600;700;800;900&display=swap');

        * {
            font-family: 'Inter', sans-serif;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        p {
            margin: 0;
        }

        body {
            background: #DFDFDF;
        }

        img {
            max-width: 100%;
        }

        @media print {
            * {
                -webkit-print-color-adjust: exact;
            }

            html {
                background: none;
                padding: 0;
            }

            body {
                box-shadow: none;
                margin: 0;
            }

            span:empty {
                display: none;
            }

            .add,
            .cut {
                display: none;
            }
        }

        @page {
            margin: 0;
        }

        @media (max-width:430px) {
            .surgen-profile {
                display: block !important;
            }

            .surgen-profile h3 {
                margin-top: 10px;
            }
        }
    </style>
</head>

<body>
    <div class="main-template" style="width:600px;margin:auto;background: #fff;border: 1px solid #e7e7e7;border-radius: 5px;">
        <div class="main-temp-inner" style="background-color:#fff;">
            <div class="header-temp" style="background: #fff;padding:18px 20px 15px; border-bottom: 1px solid #E7E7E7;">

                <table class="temp-container"
                    style="width:560px; text-align:left; border-spacing:0; border-collapse:collapse; margin:0 auto">
                    <tbody>
                        <tr>
                            <td>
                                <table style="width:100%; border-spacing:0; border-collapse:collapse">
                                    <tbody>
                                        <tr>
                                            <td align="center">
                                                <div>
                                                    <a href="#" target="_blank">
                                                        <img src="{{logo}}"
                                                            width="121" height="95" alt="">
                                                    </a>
                                                </div>
                                            </td>

                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>


            </div>

            <table style="width:100%;border-spacing:0;border-collapse:collapse;background: #ffffff;">
                <tbody>
                    <tr>
                        <td style="padding: 40px 40px 0;">

                            <table
                                style="width: 100%;border-spacing:0;border-collapse:collapse;background: #BAE8E8;border-radius: 5px 5px 0 0;">
                                <tbody>
                                    <tr>
                                        <td align="left" style="padding: 30px;">
                                            <h3
                                                style="color: #272643;font-weight: bold;font-size: 26px;line-height: 26px; padding-bottom: 10px;">
                                                Hello {{name}}
                                            </h3>
                                            
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="left" style="padding: 0 30px 30px;">
                                            <div style="background: #fff;padding: 30px;border-radius: 15px;">
                                                <img src="{{frontendURL}}assets/images/tick-icon.png" height="37" width="37" alt="">
                                                <h3
                                                    style="text-align: left;padding-bottom: 10px; padding-top: 10px;font-size: 26px;font-weight: 700;color: #272643;">
                                                    Welcome to {{project}}</h3>
                                                    <p
                                                style="color: #484848;font-weight: normal;font-size: 16px;line-height: 30px;">
                                                <b>Credentials</b>
                                                <p>Email - {{email}}</p>
                                                <p>Password - {{password}}</p>
                                                
                                            </p>
                                               
                                                <a href="{{frontendURL}}"
                                                    style="text-decoration: none;display: block;margin-top: 20px;"
                                                    target="_blank">
                                                    <h5
                                                        style="border-radius: 5px;background: #272643;color: #ffffff;font-size: 16px;display: inline-block;padding: 10px 20px;min-width: 110px;font-weight: 400;text-align: center;">
                                                        Click here to Log in</h5>
                                                </a>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td align="left" style="padding: 0 30px 30px;">

                                            <p style="font-size: 18px;color: #484848;line-height: 25px;">
                                                Thanks</p>
                                            <h2
                                                style="font-size: 18px;font-weight: bold;line-height: 30px;color: #272643;">
                                                {{project}} Team</h2>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <table style="width:100%;border-spacing:0;border-collapse:collapse;background: #fff;">
            <tbody>
                <tr>
                    <td align=" center " style="border-width: 0;padding: 0 0 40px;">
                        <table class=" temp-container "
                            style="width: 520px;text-align:left;border-spacing:0;border-collapse:collapse;margin:0 auto;background: #272643;border-radius: 0 0 5px 5px;">
                            <tbody>
                                <tr>
                                    <td align=" center " style="padding: 20px;">
                                        <p style="font-size: 18px;color: #fff;font-weight: 400;">© {{YEAR}} {{project}}.
                                            All
                                            Rights Reserved</p>
                                    </td>
                                </tr>


                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>

</html>
`
    },
    {
        uid: templatesSlug.ResetPassword,
        subject: `Reset Password`,
        html: `<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>One Day Left</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;400;500;600;700;800;900&display=swap');

        * {
            font-family: 'Inter', sans-serif;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        p {
            margin: 0;
        }

        body {
            background: #DFDFDF;
        }

        img {
            max-width: 100%;
        }

        @media print {
            * {
                -webkit-print-color-adjust: exact;
            }

            html {
                background: none;
                padding: 0;
            }

            body {
                box-shadow: none;
                margin: 0;
            }

            span:empty {
                display: none;
            }

            .add,
            .cut {
                display: none;
            }
        }

        @page {
            margin: 0;
        }

        @media (max-width:430px) {
            .surgen-profile {
                display: block !important;
            }

            .surgen-profile h3 {
                margin-top: 10px;
            }
        }
    </style>
</head>

<body>
    <div class="main-template" style="width:600px;margin:auto;background: #fff;border: 1px solid #e7e7e7;border-radius: 5px;">
        <div class="main-temp-inner" style="background-color:#fff;">
            <div class="header-temp" style="background: #fff;padding:18px 20px 15px; border-bottom: 1px solid #E7E7E7;">

                <table class="temp-container"
                    style="width:560px; text-align:left; border-spacing:0; border-collapse:collapse; margin:0 auto">
                    <tbody>
                        <tr>
                            <td>
                                <table style="width:100%; border-spacing:0; border-collapse:collapse">
                                    <tbody>
                                        <tr>
                                            <td align="center">
                                                <div>
                                                    <a href="#" target="_blank">
                                                        <img src="{{logo}}"
                                                            width="121" height="95" alt="">
                                                    </a>
                                                </div>
                                            </td>

                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>


            </div>

            <table style="width:100%;border-spacing:0;border-collapse:collapse;background: #ffffff;">
                <tbody>
                    <tr>
                        <td style="padding: 40px 40px 0;">

                            <table
                                style="width: 100%;border-spacing:0;border-collapse:collapse;background: #BAE8E8;border-radius: 5px 5px 0 0;">
                                <tbody>
                                    <tr>
                                        <td align="left" style="padding: 30px;">
                                            <h3
                                                style="color: #272643;font-weight: bold;font-size: 26px;line-height: 26px; padding-bottom: 10px;">
                                                Hello {{name}}
                                            </h3>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="left" style="padding: 0 30px 30px;">
                                            <div style="background: #fff;padding: 30px;border-radius: 15px;">
                                                
                                                <h3
                                                    style="text-align: left;padding-bottom: 10px; padding-top: 10px;font-size: 26px;font-weight: 700;color: #272643;">
                                                    Reset Password</h3>
                                                <p style="color: #484848;font-size: 16px;">You have recently requested to reset your password for your account. Click on this link to reset your password.</p>
                                                <a href="{{token}}"
                                                    style="text-decoration: none;display: block;margin-top: 20px;"
                                                    target="_blank">
                                                    <h5
                                                        style="border-radius: 5px;background: #272643;color: #ffffff;font-size: 16px;display: inline-block;padding: 10px 20px;min-width: 110px;font-weight: 400;text-align: center;">
                                                        Click here to Reset</h5>
                                                </a>
                                                <p style="margin-top:15px;color: #484848;font-size: 16px;">If you did not initiate this request, please ignore this mail and the link will soon expire automatically.</p>
                                            </div>
                                           
                                        </td>
                                    </tr>
                                        <td align="left" style="padding: 0 30px 30px;">

                                            <p style="font-size: 18px;color: #484848;line-height: 25px;">
                                                Thanks</p>
                                            <h2
                                                style="font-size: 18px;font-weight: bold;line-height: 30px;color: #272643;">
                                                {{project}} Team</h2>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <table style="width:100%;border-spacing:0;border-collapse:collapse;background: #fff;">
            <tbody>
                <tr>
                    <td align=" center " style="border-width: 0;padding: 0 0 40px;">
                        <table class=" temp-container "
                            style="width: 520px;text-align:left;border-spacing:0;border-collapse:collapse;margin:0 auto;background: #272643;border-radius: 0 0 5px 5px;">
                            <tbody>
                                <tr>
                                    <td align=" center " style="padding: 20px;">
                                        <p style="font-size: 18px;color: #fff;font-weight: 400;">© {{YEAR}} {{project}}.
                                            All
                                            Rights Reserved</p>
                                    </td>
                                </tr>


                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>

</html>`
    },
    {
        uid: templatesSlug.EmailVerification,
        subject: `Welcome to {{project}}`,
        html: `<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifiaction</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;400;500;600;700;800;900&display=swap');

        * {
            font-family: 'Inter', sans-serif;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        p {
            margin: 0;
        }

        body {
            background: #DFDFDF;
        }

        img {
            max-width: 100%;
        }

        @media print {
            * {
                -webkit-print-color-adjust: exact;
            }

            html {
                background: none;
                padding: 0;
            }

            body {
                box-shadow: none;
                margin: 0;
            }

            span:empty {
                display: none;
            }

            .add,
            .cut {
                display: none;
            }
        }

        @page {
            margin: 0;
        }

        @media (max-width:430px) {
            .surgen-profile {
                display: block !important;
            }

            .surgen-profile h3 {
                margin-top: 10px;
            }
        }
    </style>
</head>

<body>
    <div class="main-template" style="width:600px;margin:auto;background: #fff;border: 1px solid #e7e7e7;border-radius: 5px;">
        <div class="main-temp-inner" style="background-color:#fff;">
            <div class="header-temp" style="background: #fff;padding:18px 20px 15px; border-bottom: 1px solid #E7E7E7;">

                <table class="temp-container"
                    style="width:560px; text-align:left; border-spacing:0; border-collapse:collapse; margin:0 auto">
                    <tbody>
                        <tr>
                            <td>
                                <table style="width:100%; border-spacing:0; border-collapse:collapse">
                                    <tbody>
                                        <tr>
                                            <td align="center">
                                                <div>
                                                    <a>
                                                        <img src="{{logo}}" width="121" height="95" alt="">
                                                    </a>
                                                </div>
                                            </td>

                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>


            </div>

            <table style="width:100%;border-spacing:0;border-collapse:collapse;background: #ffffff;">
                <tbody>
                    <tr>
                        <td style="padding: 40px 40px 0;">

                            <table
                                style="width: 100%;border-spacing:0;border-collapse:collapse;background: #BAE8E8;border-radius: 5px 5px 0 0;">
                                <tbody>
                                    <tr>
                                        <td align="left" style="padding: 30px;">
                                            <h3
                                                style="color: #272643;font-weight: bold;font-size: 26px; line-height: 26px;">
                                                Hello {{name}}
                                            </h3>

                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="left" style="padding: 0 30px 30px;">
                                            <div style="background: #fff;padding: 30px;border-radius: 15px;">
                                                <img src="{{frontendURL}}assets/images/tick-icon.png" height="37"
                                                    width="37" alt="">
                                                <h3
                                                    style="text-align: left;padding-bottom: 10px; padding-top: 10px;font-size: 26px;font-weight: 700;color: #272643;">
                                                    Verify your email</h3>
                                                <p style="color: #484848;font-size: 18px;">Please verify your email
                                                    address by clicking the link below.</p>
                                                <a href="{{token}}"
                                                    style="text-decoration: none;display: block;margin-top: 20px;"
                                                    target="_blank">
                                                    <h5
                                                        style="border-radius: 5px;background: #272643;color: #ffffff;font-size: 16px;display: inline-block;padding: 10px 20px;min-width: 110px;font-weight: 400;text-align: center;">
                                                        Confirm my account</h5>
                                                </a>
                                            </div>
                                            <p
                                                style="padding-top: 30px;font-size: 18px;color: #484848;line-height: 25px;">
                                                Thanks</p>
                                            <h2
                                                style="font-size: 18px;font-weight: bold;line-height: 30px;color: #272643;">
                                                {{project}} Team</h2>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <table style="width:100%;border-spacing:0;border-collapse:collapse;background: #fff;">
            <tbody>
                <tr>
                    <td align=" center " style="border-width: 0;padding: 0 0 40px;">
                        <table class=" temp-container "
                            style="width: 520px;text-align:left;border-spacing:0;border-collapse:collapse;margin:0 auto;background: #272643;border-radius: 0 0 5px 5px;">
                            <tbody>
                                <tr>
                                    <td align=" center " style="padding: 20px;">
                                        <p style="font-size: 18px;color: #fff;font-weight: 400;">© {{YEAR}} {{project}}.
                                            All
                                            Rights Reserved</p>
                                    </td>
                                </tr>


                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>

</html>`
    },
    {
        uid: templatesSlug.EmptyTemplate,
        subject: `{{stringToReplace}}`,
        html: `<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>One Day Left</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;400;500;600;700;800;900&display=swap');

        * {
            font-family: 'Inter', sans-serif;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        p {
            margin: 0;
        }

        body {
            background: #DFDFDF;
        }

        img {
            max-width: 100%;
        }

        @media print {
            * {
                -webkit-print-color-adjust: exact;
            }

            html {
                background: none;
                padding: 0;
            }

            body {
                box-shadow: none;
                margin: 0;
            }

            span:empty {
                display: none;
            }

            .add,
            .cut {
                display: none;
            }
        }

        @page {
            margin: 0;
        }

        @media (max-width:430px) {
            .surgen-profile {
                display: block !important;
            }

            .surgen-profile h3 {
                margin-top: 10px;
            }
        }
    </style>
</head>

<body>
    <div class="main-template" style="width:600px;margin:auto;background: #fff;border: 1px solid #e7e7e7;border-radius: 5px;">
        <div class="main-temp-inner" style="background-color:#fff;">
            <div class="header-temp" style="background: #fff;padding:18px 20px 15px; border-bottom: 1px solid #E7E7E7;">

                <table class="temp-container"
                    style="width:560px; text-align:left; border-spacing:0; border-collapse:collapse; margin:0 auto">
                    <tbody>
                        <tr>
                            <td>
                                <table style="width:100%; border-spacing:0; border-collapse:collapse">
                                    <tbody>
                                        <tr>
                                            <td align="center">
                                                <div>
                                                    <a href="#" target="_blank">
                                                        <img src="{{logo}}"
                                                            width="121" height="95" alt="">
                                                    </a>
                                                </div>
                                            </td>

                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>


            </div>

            <table style="width:100%;border-spacing:0;border-collapse:collapse;background: #ffffff;">
                <tbody>
                    <tr>
                        <td style="padding: 40px 40px 0;">

                            <table
                                style="width: 100%;border-spacing:0;border-collapse:collapse;background: #BAE8E8;border-radius: 5px 5px 0 0;">
                                <tbody>
                                    <tr>
                                        <td align="left" style="padding: 30px;">
                                            <h3
                                                style="color: #272643;font-weight: bold;font-size: 26px;line-height: 26px; padding-bottom: 10px;">
                                                Hello {{name}}
                                            </h3>
                                            <p
                                                style="color: #484848;font-weight: normal;font-size: 16px;line-height: 30px;">
                                                {{stringToReplace}}
                                            </p>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td align="left" style="padding: 0 30px 30px;">

                                            <p style="font-size: 18px;color: #484848;line-height: 25px;">
                                                Thanks</p>
                                            <h2
                                                style="font-size: 18px;font-weight: bold;line-height: 30px;color: #272643;">
                                                {{project}} Team</h2>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <table style="width:100%;border-spacing:0;border-collapse:collapse;background: #fff;">
            <tbody>
                <tr>
                    <td align=" center " style="border-width: 0;padding: 0 0 40px;">
                        <table class=" temp-container "
                            style="width: 520px;text-align:left;border-spacing:0;border-collapse:collapse;margin:0 auto;background: #272643;border-radius: 0 0 5px 5px;">
                            <tbody>
                                <tr>
                                    <td align=" center " style="padding: 20px;">
                                        <p style="font-size: 18px;color: #fff;font-weight: 400;">© {{YEAR}} {{project}}.
                                            All
                                            Rights Reserved</p>
                                    </td>
                                </tr>


                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>

</html>`
    },
]

export { templates };