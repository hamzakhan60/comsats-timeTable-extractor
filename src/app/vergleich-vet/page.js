import CTASection from "@/components/CTASection"
import FAQSection from "@/components/FAQSection"
import UnomedNavbar from "@/components/Navbar"
import PraxisSoftwareInfo from "@/components/PraxisSoftwareInfo"
import SoftwareCardList from "@/components/SoftwareCardList"
import VeterinaryHero from "@/components/VeterinaryHero"
import Footer from "@/components/Footer";

const Vet = () => {

    return (
        <>
            <UnomedNavbar />
            <VeterinaryHero />
            <PraxisSoftwareInfo/>
            <SoftwareCardList/>
            <FAQSection/>
            <CTASection/>
            <Footer/>
        </>
    )

}

export default Vet