import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import * as DTO from './onBoarding.dto';
import { OnBoardingService } from './onBording.service';

@ApiTags('Onboarding')
@Controller('onboarding')
export class OnBoardingController {
  constructor(private service: OnBoardingService) {}

  @Post('login')
  @ApiOperation({ summary: 'Admin - Login to Platform' })
  async login(@Body() loginDTO: DTO.LoginDTO) {
    return await this.service.login(loginDTO);
  }

  @Post('login-select-institute')
  @ApiOperation({ summary: 'Admin - Select institute and login' })
  async adminSelectInstitute(@Body() dto: DTO.AdminSelectInstituteDTO) {
    return await this.service.adminSelectInstitute(dto);
  }

  @Post('ulogin')
  @ApiOperation({ summary: 'User - Login to Platform' })
  async loginAsUser(@Body() loginDTO: DTO.LoginDTO) {
    return await this.service.loginUser(loginDTO);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request to change password' })
  ForgotPassword(@Body() fpDTO: DTO.ForgotPasswordDTO) {
    return this.service.forgotPassword(fpDTO);
  }

  @Post('verify-reset-token')
  @ApiOperation({ summary: 'Verify reset token' })
  VerifyResetToken(@Body() vrtDTO: DTO.VerifyResetTokenDTO) {
    return this.service.verifyResetToken(vrtDTO);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset Password' })
  ResetPassword(@Body() vrtDTO: DTO.ResetPassDTO) {
    return this.service.resetPassword(vrtDTO);
  }

  @Post('link-institutes-superadmin')
  @ApiOperation({ summary: 'Link Super Admin to all institutes' })
  LinkUserToAllInstitutes() {
    return this.service.linkUserToAllInstitutes();
  }
}
