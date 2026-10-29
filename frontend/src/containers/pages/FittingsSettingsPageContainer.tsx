import {observer} from "mobx-react-lite";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {fittingsFormSchema} from "@/features/fittings/fittings-form-schema.ts";
import FittingsSettingsPage from "@/components/pages/FittingsSettingsPage.tsx";
import {en} from "@/text/en.ts";

const FittingsSettingsPageContainer = observer(() => {

    const form = useForm<z.infer<typeof fittingsFormSchema>>({
        resolver: zodResolver(fittingsFormSchema),
        defaultValues: {
            sampleName: en.fittingsSettingsPage.placeholders.sampleName,
            numberOfStarts: en.fittingsSettingsPage.placeholders.numberOfStarts,
            useBayesianOptimization: en.fittingsSettingsPage.placeholders.useBayesianOptimization,
            l2: en.fittingsSettingsPage.placeholders.l2,
            k1: en.fittingsSettingsPage.placeholders.k1,
            l1: en.fittingsSettingsPage.placeholders.l1,
            alfa1: en.fittingsSettingsPage.placeholders.alfa1,
            k3: en.fittingsSettingsPage.placeholders.k3,
            alfa3: en.fittingsSettingsPage.placeholders.alfa3,
            r21: en.fittingsSettingsPage.placeholders.r21,
            dPump: en.fittingsSettingsPage.placeholders.dPump,
            anisotropy: en.fittingsSettingsPage.placeholders.anisotropy,
            q: en.fittingsSettingsPage.placeholders.q,
            c2: en.fittingsSettingsPage.placeholders.c2,
        }
    });

    return (
        <FittingsSettingsPage
            form={form}
            onSubmit={async () => {}}
        />
    )
})

export default FittingsSettingsPageContainer;