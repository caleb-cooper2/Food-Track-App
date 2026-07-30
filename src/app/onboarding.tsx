import {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

import {Checklist} from '@/components/onboarding/checklist';
import {OnboardingDots} from '@/components/onboarding/onboarding-dots';
import {OnboardingFooterButton} from '@/components/onboarding/onboarding-footer-button';
import {OnboardingImage} from '@/components/onboarding/onboarding-image';
import {OnboardingPage} from '@/components/onboarding/onboarding-page';
import {QuoteCard} from '@/components/onboarding/quote-card';
import {Steps} from '@/components/onboarding/steps';
import {Warning} from '@/components/onboarding/warning';
import {Spacing} from '@/constants/theme';
import {useOnboarding} from '@/hooks/use-onboarding';
import {useTheme} from '@/hooks/use-theme';
import {ParticipantCodeInput} from "@/components/onboarding/participant-code-input";

const PAGES = [
    {
        title: 'Log meals simply',
        subtitle: 'Take a picture of your food and write a short description and we estimate volume and nutrients',
        warning: 'This is a research project. Estimates may be inaccurate, do not rely on them for medical decisions'
    },
    {
        title: 'How it works',
        instructionSteps: [
            'Snap a photo of your food',
            'Add a short description',
            'We estimate volume and nutrition info'
        ]
    },
    {
        title: 'Taking a good photo',
        image: require('@/assets/images/onboarding/example.jpeg'),
        tips: [
            'Use good lighting',
            'Keep only food in the frame, no other people or objects',
            'Aim for a slight angle from overhead'
        ]
    },
    {
        title: 'More detail is better',
        subtitle: 'Better descriptions = better estimates. Mention ingredients, sauces, oils and cooking method where possible.',
        quote: 'Grilled chicken breast, olive oil with a side of steamed broccoli and white rice'
    },
    {
        title: 'Participant code',
        subtitle: 'Enter your participant code exactly as provided by the lead researcher.'
    }
];

export default function OnboardingScreen() {
    const { completeOnboarding } = useOnboarding();
    const theme = useTheme();
    const [currentPage, setCurrentPage] = useState(0);
    const [participantCode, setParticipantCode] = useState('');
    const codeValid = /^P\d{3}$/.test(participantCode.trim());
    const isLastPage = currentPage === PAGES.length - 1;

    return (
        <View style={[styles.root, { backgroundColor: theme.background }]}>
            <Onboarding
                showPagination={false}
                currentPage={currentPage}
                pageIndexCallback={setCurrentPage}
                onDone={() => completeOnboarding(participantCode)}
                titleStyles={{ display: 'none' }}
                subTitleStyles={{ display: 'none' }}
                pages={PAGES.map((page, index) => ({
                    backgroundColor: theme.background,
                    title: '',
                    subtitle: '',
                    image: (
                        <OnboardingPage title={page.title} subtitle={page.subtitle} align={index === 0 ? 'center' : 'top-left'}>
                            {page.warning && <Warning>{page.warning}</Warning>}
                            {page.instructionSteps && <Steps steps={page.instructionSteps} />}
                            {page.image ? <OnboardingImage source={page.image} /> : null}
                            {page.tips && <Checklist items={page.tips} />}
                            {page.quote && <QuoteCard>{page.quote}</QuoteCard>}
                            {index === PAGES.length-1 && <ParticipantCodeInput value={participantCode} onChangeText={setParticipantCode}/>}
                        </OnboardingPage>
                    )
                }))}
            />

            <View style={styles.footer}>
                <OnboardingDots count={PAGES.length} activeIndex={currentPage} />
                <OnboardingFooterButton
                    disabled={isLastPage && !codeValid}
                    label={isLastPage ? 'Get started' : 'Next'}
                    onPress={() => (isLastPage ? completeOnboarding(participantCode) : setCurrentPage((page) => page + 1))}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: Spacing.four,
        gap: Spacing.four
    }
});
