// import { Injectable, UnauthorizedException, BadRequestException, Logger, Inject } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcryptjs';
// import { ParentSignupDto, ParentSigninDto, ConnectChildrenDto, DisconnectChildrenDto, UpdateParentProfileDto } from '../dto/auth.dto';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { EventEmitter2 } from '@nestjs/event-emitter';
// import { RoleEnum } from '@prisma/client';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Cache } from 'cache-manager';
// import { firebaseAuth } from 'src/config/firebase.config';
// import { UpdateProfileDto } from '../dto/auth.dto'; // Adjust path as needed
// import { OAuth2Client } from 'google-auth-library';



// @Injectable()
// export class ParentAuthService {
//   updateProfile: any;
//   generateToken: any;
//   sanitizeParent: any;
 
//   getChildren(parentId: string) {
//     throw new Error('Method not implemented.');
//   }
//   connectChildren(parentId: string, dto: ConnectChildrenDto) {
//     throw new Error('Method not implemented.');
//   }
//   loginWithPhoneNumber(idToken: string) {
//     throw new Error('Method not implemented.');
//   }
//   googleLogin(token: string) {
//     throw new Error('Method not implemented.');
//   }
//   signin(dto: ParentSigninDto) {
//     throw new Error('Method not implemented.');
//   }
//   private googleClient: OAuth2Client;

//   constructor(
//     private prisma: PrismaService,
//     private jwtService: JwtService,
//     private eventEmitter: EventEmitter2,
//     @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
//   ) {
//     this.googleClient = new OAuth2Client(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET
//     );
//   }
//   async signup(dto: ParentSignupDto) {
//     const existingParent = await this.prisma.user.findUnique({
//       where: {
//         email: dto.email
//       },
//     });

//     if (existingParent) {
//       throw new BadRequestException('Email already exists');
//     }    const hashedPassword = await bcrypt.hash(dto.password, 10);
//     const verificationToken = this.jwtService.sign(
//       { email: dto.email, role: RoleEnum.parent },
//       { expiresIn: '1h' }
//     );

//     const parent = await this.prisma.parent.create({
//       data: {
//         user: {
//           create: {
//             email: dto.email,
//             password: hashedPassword,
//             name: dto.name,
//             role: RoleEnum.parent,
//             verified: false,
//           }
//         },
//         address: dto.address,
//       },
//       include: {
//         user: true,
//         students: true,
//       }
//     });

//     // Store verification token in cache
//     await this.cacheManager.set(
//       `user-verification:${verificationToken}`,
//       JSON.stringify({
//         email: dto.email,
//         role: RoleEnum.parent,
//       }),
//       60 * 60 * 1000 // 1 hour expiry
//     );

//     this.eventEmitter.emit('user.sendVerificationLink', {
//       email: parent.user.email,
//       role: parent.user.role,
//     });

//     return {
//       token: this.generateToken(parent),
//       parent: this.sanitizeParent(parent),
//       message: 'Signup successful. Please verify your email to continue.',
//     };
//   }

//   async verifyEmail(verificationToken: string) {
//     try {
//       const cacheKey = `user-verification:${verificationToken}`;
//       const userData: any = await this.cacheManager.get(cacheKey);
//       if (!userData) {
//         throw new BadRequestException('Invalid link or link has been expired');
//       }
//       const user = JSON.parse(userData);

//       const userUpdated = await this.prisma.user.update({
//         where: {
//           email: user?.email,
//           role: user?.role,
//         },
//         data: {
//           verified: true,
//         },
//       });

//       // Remove the verification token from cache after successful verification
//       await this.cacheManager.del(cacheKey);

//       return { message: 'Parent account has been verified successfully' };
//     } catch (error) {
//       if (error.statusCode === 500) {
//         Logger.error(error?.stack);
//       }
//       throw error;
//     }
//   }
  
//   } 
  
//   async loginWithPhoneNumber(idToken: string) {
//     try {
//       const decodedToken = await firebaseAuth.verifyIdToken(idToken);
//       const firebaseUser = await firebaseAuth.getUser(decodedToken.uid);

//   //   try {
//   //     const decodedToken = await firebaseAuth.verifyIdToken(idToken);
//   //     const firebaseUser = await firebaseAuth.getUser(decodedToken.uid);

//   //     let user = await this.prisma.user.findFirst({
//   //       where: { firebaseUid: firebaseUser.uid },
//   //     });

//   //     if (!user) {
//   //       user = await this.prisma.user.create({
//   //         data: {
//   //           name: firebaseUser.displayName ?? 'Unknown User',
//   //           email: firebaseUser.email ?? null,
//   //           role: RoleEnum.parent,
//   //           firebaseUid: firebaseUser.uid,
//   //           verified: true, // Phone-based login is automatically verified
//   //           phoneNumber: firebaseUser.phoneNumber,
//   //           parent: {
//   //             create: {},
//   //           },
//   //         },
//   //         include: {
//   //           parent: true
//   //         }
//   //       });
//   //     }
//   //     const parent = await this.prisma.parent.findUnique({
//   //       where: {
//   //         userId: user.id,
//   //       },
//   //       select: {
//   //         id: true,
//   //       },
//   //     });
//   //     // Payload to return after verification/login/signup
//   //     const payload = {
//   //       userId: user.id,
//   //       name: user.name,
//   //       email: user.email,
//   //       role: RoleEnum.parent,
//   //       parentId: parent.id,
//   //     };

//   //     return {
//   //       access_token: this.jwtService.sign(payload),
//   //       user: payload,
//   //     };
//   //   } catch (error) {
//   //     if (error.statusCode === 500) {
//   //       Logger.error(error?.stack);
//   //     }
//   //     throw error;
//   //   }
//   // } 
  
//       return {
//         access_token: this.jwtService.sign(payload),
//         user: payload,
//       };
//     } catch (error) {
//       if (error.statusCode === 500) {
//         Logger.error(error?.stack);
//       }
//       throw error;
//     }
//   } 
  
//   async googleLogin(token: string) {
//     try {
//       const ticket = await this.googleClient.verifyIdToken({
//         idToken: token,
//         audience: process.env.GOOGLE_CLIENT_ID
//       });

//       const payload = ticket.getPayload();
//       const email = payload.email;

//       let user = await this.prisma.user.findFirst({
//         where: {
//           email: email,
//           role: RoleEnum.parent
//         },
//         include: {
//           parent: true
//         }
//       });

//       if (!user) {
//         user = await this.prisma.user.create({
//           data: {
//             email: email,
//             name: payload.name,
//             role: RoleEnum.parent,
//             verified: true, // Google accounts are pre-verified
//             googleId: payload.sub,
//             parent: {
//               create: {}
//             }
//           },
//           include: {
//             parent: true
//           }
//         });
//       } else if (!user.googleId) {
//         // Update existing user with Google ID if not set
//         user = await this.prisma.user.update({
//           where: { id: user.id },
//           data: { googleId: payload.sub },
//           include: { parent: true }
//         });
//       }

//       const tokenPayload = {
//         userId: user.id,
//         name: user.name,
//         email: user.email,
//         role: RoleEnum.parent,
//         parentId: user.parent.id
//       };

//       return {
//         access_token: this.jwtService.sign(tokenPayload),
//         user: tokenPayload
//       };
//     } catch (error) {
//       if (error.statusCode === 500) {
//         Logger.error(error?.stack);
//       }
//       throw new UnauthorizedException('Invalid Google token');
//     }
//   }

//   async signin(dto: ParentSigninDto) {
//     const parent = await this.prisma.parent.findFirst({
//       where: {
//         user: {
//           email: dto.email
//         }
//       },
//       include: {
//         user: true,
//         students: true
//       }
//     });

//     if (!parent || !await bcrypt.compare(dto.password, parent.user.password)) {
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     // Check if the user is verified
//     if (!parent.user.verified) {
//       throw new UnauthorizedException('Please verify your email before logging in');
//     }

//     return {
//       token: this.generateToken(parent),
//       parent: this.sanitizeParent(parent)
//     };
//   }


  
//   async connectChildren(parentId: string, dto: ConnectChildrenDto) {
//     // First verify the parent exists
//     const parent = await this.prisma.parent.findUnique({
//       where: {
//         id: parentId // Using the string ID directly
//       }
//     });
//     if (!parent) {
//       throw new BadRequestException('Parent not found');
//     }

//     await this.prisma.parent.update({
//       where: { id: parentId },
//       data: {
//         students: {
//           connect: dto.studentIds.map(id => ({ id }))
//         }
//       }
//     });

//     return { message: 'Children connected successfully' };
//   }



//   async disconnectChildren(parentId: string, dto: DisconnectChildrenDto) {
//     // First verify the parent exists
//     const parent = await this.prisma.parent.findUnique({
//       where: {
//         id: parentId // Using the string ID directly
//       }
//     });
//     if (!parent) {
//       throw new BadRequestException('Parent not found');
//     }

//     // Disconnect multiple children from the parent
//     await this.prisma.parent.update({
//       where: { id: parentId },
//       data: {
//         students: {
//           disconnect: dto.studentIds.map(id => ({ id }))
//         }
//       }
//     });

//     return { message: 'Children disconnected successfully' };
//   }



//   async getChildren(parentId: string) {
//     const parent = await this.prisma.parent.findUnique({
//       where: {
//         id: parentId
//       },
//       include: {
//         students: {
//           include: {
//             user: true

//           }
//         }
//       }
//     });

//     if (!parent) {
//       throw new BadRequestException('Parent not found');
//     }

//     const childrenDetails = parent.students.map(student => ({
//       studentId: student.id,      // Student record's ID
//       userId: student.user?.id,   // Student's User ID
//       name: student.user?.name,
//       address: student?.user?.address   // Student's name
//     }));

//     return {
//       parentId: parent.id,
//       children: childrenDetails
//     };
//   }

//   private generateToken(parent: any) {
//     return this.jwtService.sign({
//       id: parent.id,
//       email: parent.user.email,
//       role: 'parent',
//       userId: parent.user.id
//     });
//   }

//   private sanitizeParent(parent: any) {
//     const { user, ...parentData } = parent;
//     return {
//       ...parentData,
//       name: user.name,
//       email: user.email
//     };
//   }


// async loginWithGoogle(idToken: string) {
//   const decoded = await firebaseAuth.verifyIdToken(idToken);
//   const firebaseUser = await firebaseAuth.getUser(decoded.uid);

//   // Find user in your DB by Firebase UID
//   const user = await this.prisma.user.findFirst({
//     where: { firebaseUid: firebaseUser.uid },
//     include: { parent: true }
//   });

//   if (!user || user.role !== 'parent' || !user.parent) {
//     throw new UnauthorizedException('Parent not found');
//   }

//   const payload = {
//     id: user.parent.id,
//     email: user.email,
//     role: user.role,
//   };

//   const token = this.jwtService.sign(payload);

//   return {
//     token,
//     parent: {
//       ...user.parent,
//       name: user.name,
//       email: user.email,
//     }
//   };
// }


// async signupWithGoogle(idToken: string) {
//   return this.loginWithGoogle(idToken);
// }


//  async loginWithPhone(idToken: string) {
//     try {
//       console.log('📥 Received Firebase ID Token:', idToken);

//       // ✅ Verify Firebase Token
//       const decodedToken = await firebaseAuth.verifyIdToken(idToken);
//       const firebaseUser = await firebaseAuth.getUser(decodedToken.uid);

//       console.log('🔐 Decoded Firebase User:', firebaseUser);

//       // 🔍 Find user by Firebase UID
//       let user = await this.prisma.user.findFirst({
//         where: { firebaseUid: firebaseUser.uid },
//         include: { parent: true },
//       });

//       // 🆕 If user doesn't exist, create new one
//       if (!user) {
//         user = await this.prisma.user.create({
//           data: {
//             name: firebaseUser.displayName || 'New Parent',
//             email: firebaseUser.email || null,
//             phoneNumber: firebaseUser.phoneNumber,
//             firebaseUid: firebaseUser.uid,
//             role: RoleEnum.parent,
//             verified: true,
//             parent: {
//               create: { address: '' },
//             },
//           },
//           include: { parent: true },
//         });

//         console.log('🆕 New user created:', user);
//       }

//       // ❌ User exists but not a parent
//       if (!user.parent || user.role !== RoleEnum.parent) {
//         throw new UnauthorizedException('Parent not found or invalid role');
//       }

//       // ✅ Create JWT Token
//       const payload = {
//         id: user.parent.id,
//         email: user.email,
//         role: user.role,
//       };

//       const token = this.jwtService.sign(payload);

//       // ✅ Return response
//       return {
//         token,
//         parent: {
//           ...user.parent,
//           name: user.name,
//           email: user.email,
//         },
//       };
//     } catch (err) {
//       console.error('❌ loginWithPhone Error:', err);
//     //  throw new InternalServerErrorException('Login with phone failed.');
//     }
//   }
// async updateParentProfile(parentId: string, dto: UpdateProfileDto) {
//   const updatedParent = await this.prisma.parent.update({
//     where: { id: parentId },
//     data: {
//       address: dto.address,
//       user: {
//         update: {
//           name: dto.name,
//           email: dto.email,
//           phoneNumber: dto.phoneNumber,
//         },
//       },
//     },
//     include: { user: true },
//   });

//   return {
//     updatedUser: {
//       id: updatedParent.user.id,
//       name: updatedParent.user.name,
//       email: updatedParent.user.email,
//       phoneNumber: updatedParent.user.phoneNumber,
//       address: updatedParent.address,
//     },
//   };
// }
// async verifyGoogleIdToken(idToken: string) {
//   try {
//     // 1. Verify token using Firebase Admin SDK
//     const decoded = await firebaseAuth.verifyIdToken(idToken);
//     const firebaseUser = await firebaseAuth.getUser(decoded.uid);

//     // 2. Check if the user exists in DB
//     const user = await this.prisma.user.findFirst({
//       where: { firebaseUid: firebaseUser.uid },
//       include: { parent: true },
//     });

//     if (!user || !user.parent || user.role !== RoleEnum.parent) {
//       throw new UnauthorizedException('Parent user not found or role mismatch.');
//     }

//     // 3. Generate JWT
//     const payload = {
//       id: user.parent.id,
//       email: user.email,
//       role: user.role,
//     };

//     const token = this.jwtService.sign(payload);

//     // 4. Return parent info
//     return {
//       token,
//       parent: {
//         ...user.parent,
//         name: user.name,
//         email: user.email,
//       },
//     };
//   } catch (err) {
//     console.error('❌ Error verifying Google ID token:', err);
//     throw new UnauthorizedException('Invalid or expired Google ID token');
//   }
// }
// // async findOrCreateParentUserFromGoogle(profile: {
// //   id: string;
// //   email: string;
// //   name: string;
// //   picture?: string;
// // }) {
// //   const user = await this.prisma.user.findFirst({
// //     where: {
// //       email: profile.email,
// //       firebaseUid: profile.id, // assuming profile.id is Google UID
// //       role: RoleEnum.parent,
// //     },
// //     include: {
// //       parent: true,
// //     },
// //   });

// //   if (user?.parent) return user.parent;

// //   const newUser = await this.prisma.user.create({
// //     data: {
// //       name: profile.name,
// //       email: profile.email,
// //       firebaseUid: profile.id,
// //       role: RoleEnum.parent,
// //       verified: true,
// //       parent: {
// //         create: {},
// //       },
// //     },
// //     include: {
// //       parent: true,
// //     },
// //   });

// //   return newUser.parent;
// // }

// async findOrCreateParentUserFromGoogle(profile: {
//   id: string;
//   email: string;
//   name: string;
//   picture?: string;
// }) {
//   const email = profile.email.toLowerCase();

//   // Step 1: Upsert ensures no duplicate email issue
//   const user = await this.prisma.user.upsert({
//     where: { email },
//     update: {}, // No changes to update now
//     create: {
//       name: profile.name,
//       email,
//       firebaseUid: profile.id, // Google UID
//       role: RoleEnum.parent,
//       verified: true,
    
//     },
//   });

//   // Step 2: Check if parent exists
//   let parent = await this.prisma.parent.findUnique({
//     where: { userId: user.id },
//   });

//   // Step 3: Create parent if not exists
//   if (!parent) {
//     parent = await this.prisma.parent.create({
//       data: {
//         user: { connect: { id: user.id } },
//       },
//     });
//   }

//   return parent;
// }

//   async updateProfile(user: any, dto: UpdateParentProfileDto) {
//     try {
//       const updateData: any = {};
//       const parentUpdateData: any = {};
  
//       // If new password is provided, validate current password
//       if (dto.newPassword?.trim()) {
//         if (!dto.currentPassword?.trim()) {
//           throw new BadRequestException('Current password is required to set new password');
//         }
  
//         const currentUser = await this.prisma.user.findUnique({
//           where: { id: user.userId },
//         });
  
//         const isPasswordValid = await bcrypt.compare(dto.currentPassword, currentUser.password);
//         if (!isPasswordValid) {
//           throw new BadRequestException('Current password is incorrect');
//         }
  
//         updateData.password = await bcrypt.hash(dto.newPassword, 10);
//       }
  
//       // Update name if provided
//       if (dto.name?.trim()) {
//         updateData.name = dto.name.trim();
//       }
  
//       // Update address if provided
//       if (dto.address?.trim()) {
//         parentUpdateData.address = dto.address.trim();
//       }
  
//       const updatedUser = await this.prisma.user.update({
//         where: { id: user.userId },
//         data: {
//           ...updateData,
//           parent: {
//             update: parentUpdateData,
//           },
//         },
//         include: {
//           parent: true,
//         },
//       });
  
//       return {
//         message: 'Profile updated successfully',
//         user: {
//           id: updatedUser.id,
//           name: updatedUser.name,
//           email: updatedUser.email,
//           role: updatedUser.role,
//           address: updatedUser.parent?.address || null,
//         },
//       };
//     } catch (error) {
//       if (error.code === 'P2002') {
//         throw new BadRequestException('Email already exists');
//       }
//       throw error;
//     }
//   }
  
//   async getProfile(user: any) {
//     try {
//       const userProfile = await this.prisma.user.findUnique({
//         where: {
//           id: user.userId,
//           role: RoleEnum.parent,
//         },
//         select: {
//           id: true,
//           name: true,
//           email: true,
//           phoneNumber: true,
//           firebaseUid: true,
//           role: true,
//           verified: true,
//           parent: {
//             select: {
//               id: true,
//               address: true,
//               students: {
//                 select: {
//                   id: true,
//                   user: {
//                     select: {
//                       name: true,
//                       email: true
//                     }
//                   },
//                   studentCourseEnrolled: {
//                     select: {
//                       course: {
//                         select: {
//                           id: true,
//                           title: true,
//                           description: true
//                         }
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       });

//       if (!userProfile) {
//         throw new UnauthorizedException('Parent profile not found');
//       }

//       return userProfile;
//     } catch (error) {
//       throw error;
//     }
//   } 

import { Injectable, UnauthorizedException, BadRequestException, Logger, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ParentSignupDto, ParentSigninDto, ConnectChildrenDto, DisconnectChildrenDto  } from '../dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RoleEnum } from '@prisma/client';
import { Prisma } from '@prisma/client'
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { firebaseAuth } from 'src/config/firebase.config';
import { UpdateProfileDto } from '../dto/auth.dto'; // Adjust path as needed
import { UpdateParentProfileDto } from '../dto/auth.dto';
import { OAuth2Client } from 'google-auth-library';

import { GoogleService } from '@modules/common/services/google/google.service';

@Injectable()
export class ParentAuthService {
  googleClient: OAuth2Client;
constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.googleClient = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
  }

  async googleLogin(token: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      const email = payload.email;

      let user = await this.prisma.user.findFirst({
        where: {
          email: email,
          role: RoleEnum.parent
        },
        include: {
          parent: true
        }
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email: email,
            name: payload.name,
            role: RoleEnum.parent,
            verified: true, // Google accounts are pre-verified
            googleId: payload.sub,
            parent: {
              create: {}
            }
          },
          include: {
            parent: true
          }
        });
      } else if (!user.googleId) {
        // Update existing user with Google ID if not set
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { googleId: payload.sub },
          include: { parent: true }
        });
      }

      const tokenPayload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: RoleEnum.parent,
        parentId: user.parent.id
      };

      return {
        access_token: this.jwtService.sign(tokenPayload),
        user: tokenPayload
      };
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  async signup(dto: ParentSignupDto) {
    const existingParent = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      },
    });

    if (existingParent) {
      throw new BadRequestException('Email already exists');
    }    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const verificationToken = this.jwtService.sign(
      { email: dto.email, role: RoleEnum.parent },
      { expiresIn: '1h' }
    );

    const parent = await this.prisma.parent.create({
      data: {
        user: {
          create: {
            email: dto.email,
            password: hashedPassword,
            name: dto.name,
            role: RoleEnum.parent,
            verified: false,
          }
        },
        address: dto.address,
      },
      include: {
        user: true,
        students: true,
      }
    });

    // Store verification token in cache
    await this.cacheManager.set(
      `user-verification:${verificationToken}`,
      JSON.stringify({
        email: dto.email,
        role: RoleEnum.parent,
      }),
      60 * 60 * 1000 // 1 hour expiry
    );

    this.eventEmitter.emit('user.sendVerificationLink', {
      email: parent.user.email,
      role: parent.user.role,
    });

    return {
      token: this.generateToken(parent),
      parent: this.sanitizeParent(parent),
      message: 'Signup successful. Please verify your email to continue.',
    };
  }

  async verifyEmail(verificationToken: string) {
    try {
      const cacheKey = `user-verification:${verificationToken}`;
      const userData: any = await this.cacheManager.get(cacheKey);
      if (!userData) {
        throw new BadRequestException('Invalid link or link has been expired');
      }
      const user = JSON.parse(userData);

      const userUpdated = await this.prisma.user.update({
        where: {
          email: user?.email,
          role: user?.role,
        },
        data: {
          verified: true,
        },
      });

      // Remove the verification token from cache after successful verification
      await this.cacheManager.del(cacheKey);

      return { message: 'Parent account has been verified successfully' };
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }
  

  //   try {
  //     const decodedToken = await firebaseAuth.verifyIdToken(idToken);
  //     const firebaseUser = await firebaseAuth.getUser(decodedToken.uid);

  //     let user = await this.prisma.user.findFirst({
  //       where: { firebaseUid: firebaseUser.uid },
  //     });

  //     if (!user) {
  //       user = await this.prisma.user.create({
  //         data: {
  //           name: firebaseUser.displayName ?? 'Unknown User',
  //           email: firebaseUser.email ?? null,
  //           role: RoleEnum.parent,
  //           firebaseUid: firebaseUser.uid,
  //           verified: true, // Phone-based login is automatically verified
  //           phoneNumber: firebaseUser.phoneNumber,
  //           parent: {
  //             create: {},
  //           },
  //         },
  //         include: {
  //           parent: true
  //         }
  //       });
  //     }
  //     const parent = await this.prisma.parent.findUnique({
  //       where: {
  //         userId: user.id,
  //       },
  //       select: {
  //         id: true,
  //       },
  //     });
  //     // Payload to return after verification/login/signup
  //     const payload = {
  //       userId: user.id,
  //       name: user.name,
  //       email: user.email,
  //       role: RoleEnum.parent,
  //       parentId: parent.id,
  //     };

  //     return {
  //       access_token: this.jwtService.sign(payload),
  //       user: payload,
  //     };
  //   } catch (error) {
  //     if (error.statusCode === 500) {
  //       Logger.error(error?.stack);
  //     }
  //     throw error;
  //   }
  // } 
  
  async signin(dto: ParentSigninDto) {
    const parent = await this.prisma.parent.findFirst({
      where: {
        user: {
          email: dto.email
        }
      },
      include: {
        user: true,
        students: true
      }
    });

    if (!parent || !await bcrypt.compare(dto.password, parent.user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if the user is verified
    if (!parent.user.verified) {
      throw new UnauthorizedException('Please verify your email before logging in');
    }

    return {
      token: this.generateToken(parent),
      parent: this.sanitizeParent(parent)
    };
  }


  
  async connectChildren(parentId: string, dto: ConnectChildrenDto) {
    // First verify the parent exists
    const parent = await this.prisma.parent.findUnique({
      where: {
        id: parentId // Using the string ID directly
      }
    });
    if (!parent) {
      throw new BadRequestException('Parent not found');
    }

    await this.prisma.parent.update({
      where: { id: parentId },
      data: {
        students: {
          connect: dto.studentIds.map(id => ({ id }))
        }
      }
    });

    return { message: 'Children connected successfully' };
  }



  async disconnectChildren(parentId: string, dto: DisconnectChildrenDto) {
    // First verify the parent exists
    const parent = await this.prisma.parent.findUnique({
      where: {
        id: parentId // Using the string ID directly
      }
    });
    if (!parent) {
      throw new BadRequestException('Parent not found');
    }

    // Disconnect multiple children from the parent
    await this.prisma.parent.update({
      where: { id: parentId },
      data: {
        students: {
          disconnect: dto.studentIds.map(id => ({ id }))
        }
      }
    });

    return { message: 'Children disconnected successfully' };
  }



  async getChildren(parentId: string) {
    const parent = await this.prisma.parent.findUnique({
      where: {
        id: parentId
      },
      include: {
        students: {
          include: {
            user: true

          }
        }
      }
    });

    if (!parent) {
      throw new BadRequestException('Parent not found');
    }

    const childrenDetails = parent.students.map(student => ({
      studentId: student.id,      // Student record's ID
      userId: student.user?.id,   // Student's User ID
      name: student.user?.name,
      address: student?.user?.address   // Student's name
    }));

    return {
      parentId: parent.id,
      children: childrenDetails
    };
  }

  private generateToken(parent: any) {
    return this.jwtService.sign({
      id: parent.id,
      email: parent.user.email,
      role: 'parent',
      userId: parent.user.id
    });
  }

  private sanitizeParent(parent: any) {
    const { user, ...parentData } = parent;
    return {
      ...parentData,
      name: user.name,
      email: user.email
    };
  }
async updateProfile(user: any, dto: UpdateParentProfileDto) {
  try {
    const updateData: any = {};
    const parentUpdateData: any = {};

    // ✅ Password update (with validation)
    if (dto.newPassword?.trim()) {
      if (!dto.currentPassword?.trim()) {
        throw new BadRequestException('Current password is required to set new password');
      }

      const currentUser = await this.prisma.user.findUnique({
        where: { id: user.userId },
      });

      const isPasswordValid = await bcrypt.compare(dto.currentPassword, currentUser.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Current password is incorrect');
      }

      updateData.password = await bcrypt.hash(dto.newPassword, 10);
    }

    // ✅ Name update
    if (dto.name?.trim()) {
      updateData.name = dto.name.trim();
    }

    // ✅ Phone number update
    if (dto.phoneNumber?.trim()) {
      updateData.phoneNumber = dto.phoneNumber.trim();
    }

    // ✅ Address update (in parent relation)
    if (dto.address?.trim()) {
      parentUpdateData.address = dto.address.trim();
    }

    // ✅ Update user with nested parent update
    const updatedUser = await this.prisma.user.update({
      where: { id: user.userId },
      data: {
        ...updateData,
        parent: {
          update: parentUpdateData,
        },
      },
      include: {
        parent: true,
      },
    });

    return {
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phoneNumber: updatedUser.phoneNumber,
        address: updatedUser.parent?.address || null,
      },
    };
  } catch (error) {
    if (error.code === 'P2002') {
      throw new BadRequestException('Email or phone number already exists');
    }
    throw error;
  }
}

  
  async getProfile(user: any) {
    try {
      const userProfile = await this.prisma.user.findUnique({
        where: {
          id: user.userId,
          role: RoleEnum.parent,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          firebaseUid: true,
          role: true,
          verified: true,
          parent: {
            select: {
              id: true,
              address: true,
              students: {
                select: {
                  id: true,
                  user: {
                    select: {
                      name: true,
                      email: true
                    }
                  },
                  studentCourseEnrolled: {
                    select: {
                      course: {
                        select: {
                          id: true,
                          title: true,
                          description: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!userProfile) {
        throw new UnauthorizedException('Parent profile not found');
      }

      return userProfile;
    } catch (error) {
      throw error;
    }
  } 
  async findOrCreateParentUserFromGoogle(profile: {
  id: string;
  email: string;
  name: string;
  picture?: string;
}) {
  const email = profile.email.toLowerCase();

  // Step 1: Upsert ensures no duplicate email issue
  const user = await this.prisma.user.upsert({
    where: { email },
    update: {}, // No changes to update now
    create: {
      name: profile.name,
      email,
      firebaseUid: profile.id, // Google UID
      role: RoleEnum.parent,
      verified: true,
    
    },
  });

  // Step 2: Check if parent exists
  let parent = await this.prisma.parent.findUnique({
    where: { userId: user.id },
  });

  // Step 3: Create parent if not exists
  if (!parent) {
    parent = await this.prisma.parent.create({
      data: {
        user: { connect: { id: user.id } },
      },
    });
  }

  return parent;
}



}
