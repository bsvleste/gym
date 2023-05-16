import { Image, IImageProps } from "native-base";

type UserPhotoProps = IImageProps & {
  size: number
}
export function UserPhoto({ size, ...props }: UserPhotoProps) {
  return (
    <Image
      w={size}
      h={size}
      rounded='full'
      borderWidth={2}
      borderColor='gray.400'
      {...props}
    />
  )
}