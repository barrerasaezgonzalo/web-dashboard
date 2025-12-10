import Image from "next/image"

export const BackGround: React.FC = () => {
    return (<div className="absolute top-0 left-0 w-full h-full -z-10" data-testid="BackGround">
        <Image
            src="/bg.jpg"
            alt="Fondo"
            fill={true}
            className="object-cover fixed top-0 left-0 z-0"
            priority={true}
        />
    </div>)
}