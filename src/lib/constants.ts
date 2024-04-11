import BarChart from "@/components/icons/bar_chart";
import Calendar from "@/components/icons/calendar";
import CheckCircle from "@/components/icons/check_circled";
import Chip from "@/components/icons/chip";
import ClipboardIcon from "@/components/icons/clipboardIcon";
import Compass from "@/components/icons/compass";
import Database from "@/components/icons/database";
import Flag from "@/components/icons/flag";
import Headphone from "@/components/icons/headphone";
import Home from "@/components/icons/home";
import Info from "@/components/icons/info";
import LinkIcon from "@/components/icons/link";
import Lock from "@/components/icons/lock";
import Message from "@/components/icons/messages";
import Notification from "@/components/icons/notification";
import Payment from "@/components/icons/payment";
import Person from "@/components/icons/person";
import Pipelines from "@/components/icons/pipelines";
import PlanitCategory from "@/components/icons/planit-category";
import Power from "@/components/icons/power";
import Receipt from "@/components/icons/receipt";
import Send from "@/components/icons/send";
import Settings from "@/components/icons/settings";
import Shield from "@/components/icons/shield";
import Star from "@/components/icons/star";
import Tune from "@/components/icons/tune";
import Video from "@/components/icons/video_recorder";
import Wallet from "@/components/icons/wallet";
import Warning from "@/components/icons/warning";
import { TEditorElement } from "@/hooks/use-editor";
import { SubscriptionPlan } from "@prisma/client";

export const appConstants = {
  agencyPercentage: 2,
  productPercentage: 2,
};

type PricingCardTypes = {
  id: string;
  title: string;
  plan: SubscriptionPlan;
  price: number;
  description: string;
  duration: string;
  highlight: string;
  features: string[];
};

export const pricingCards: PricingCardTypes[] = [
  {
    id: "1",
    title: "Starter",
    plan: "STARTER",
    description: "Perfect plan for trying out Planit",
    price: 29,
    duration: "month",
    highlight: "Key features",
    features: ["3 Sub accounts", "2 Team members", "Unlimited pipelines"],
  },
  {
    id: "2",
    title: "Basic",
    plan: "BASIC",
    description: "For serious agency owners",
    price: 99,
    duration: "month",
    highlight: "Everything in Starter, plus",
    features: ["Unlimited Sub accounts", "Unlimited Team members"],
  },

  {
    id: "3",
    title: "Unlimited Saas",
    plan: "UNLIMITED",
    description: "The ultimate agency kit",
    price: 299,
    duration: "month",
    highlight: "Everything in Starter and Basic, plus",
    features: ["Rebilling", "24/7 Support team"],
  },
];

export const appIcons = [
  {
    value: "chart",
    label: "Bar Chart",
    path: BarChart,
  },
  {
    value: "headphone",
    label: "Headphones",
    path: Headphone,
  },
  {
    value: "send",
    label: "Send",
    path: Send,
  },
  {
    value: "pipelines",
    label: "Pipelines",
    path: Pipelines,
  },
  {
    value: "calendar",
    label: "Calendar",
    path: Calendar,
  },
  {
    value: "settings",
    label: "Settings",
    path: Settings,
  },
  {
    value: "check",
    label: "Check Circled",
    path: CheckCircle,
  },
  {
    value: "chip",
    label: "Chip",
    path: Chip,
  },
  {
    value: "compass",
    label: "Compass",
    path: Compass,
  },
  {
    value: "database",
    label: "Database",
    path: Database,
  },
  {
    value: "flag",
    label: "Flag",
    path: Flag,
  },
  {
    value: "home",
    label: "Home",
    path: Home,
  },
  {
    value: "info",
    label: "Info",
    path: Info,
  },
  {
    value: "link",
    label: "Link",
    path: LinkIcon,
  },
  {
    value: "lock",
    label: "Lock",
    path: Lock,
  },
  {
    value: "messages",
    label: "Messages",
    path: Message,
  },
  {
    value: "notification",
    label: "Notification",
    path: Notification,
  },
  {
    value: "payment",
    label: "Payment",
    path: Payment,
  },
  {
    value: "power",
    label: "Power",
    path: Power,
  },
  {
    value: "receipt",
    label: "Receipt",
    path: Receipt,
  },
  {
    value: "shield",
    label: "Shield",
    path: Shield,
  },
  {
    value: "star",
    label: "Star",
    path: Star,
  },
  {
    value: "tune",
    label: "Tune",
    path: Tune,
  },
  {
    value: "videorecorder",
    label: "Video Recorder",
    path: Video,
  },
  {
    value: "wallet",
    label: "Wallet",
    path: Wallet,
  },
  {
    value: "warning",
    label: "Warning",
    path: Warning,
  },
  {
    value: "person",
    label: "Person",
    path: Person,
  },
  {
    value: "category",
    label: "Category",
    path: PlanitCategory,
  },
  {
    value: "clipboardIcon",
    label: "Clipboard Icon",
    path: ClipboardIcon,
  },
];

export const defaultStyles: React.CSSProperties = {
  backgroundPosition: "center",
  objectFit: "cover",
  backgroundRepeat: "no-repeat",
  textAlign: "left",
  opacity: "100%",
};


export const defaultPageElement: TEditorElement = {
  content: [],
  id: "__body",
  name: "Body",
  styles: {},
  type: "__body",
};

export const agencyIdSideBarOptions = [
  {
    name: "Dashboard",
    icon: "category",
    link: ``,
  },
  {
    name: "Settings",
    icon: "settings",
    link: `settings`,
  },
  {
    name: "Sub Accounts",
    icon: "person",
    link: `subaccounts`,
  },
  {
    name: "Team",
    icon: "shield",
    link: `team`,
  },
  {
    name: "Media",
    icon: "database",
    link: `media`,
  },
];

export const subAccountIdSideBarOptions = [
  {
    name: "Dashboard",
    icon: "category",
    link: ``,
  },
  {
    name: "Team",
    icon: "shield",
    link: `team`,
  },
  {
    name: "Settings",
    icon: "settings",
    link: `settings`,
  },
  {
    name: "Funnels",
    icon: "flag",
    link: `funnels`,
  },
  {
    name: "Media",
    icon: "database",
    link: `media`,
  },
  {
    name: "Pipelines",
    icon: "pipelines",
    link: `pipelines`,
  },
  {
    name: "Contacts",
    icon: "person",
    link: `contacts`,
  },
];



export const fakeDataSessions = [
  {
    id: "1",
    created: new Date(
      new Date().getTime() + 2 * 60 * 60 * 1000
    ).toLocaleDateString(),
    amount_total: 200,
  },
  {
    id: "2",
    created: new Date(
      new Date().getTime() + 5 * 60 * 60 * 1000
    ).toLocaleDateString(),
    amount_total: 500,
  },
  {
    id: "3",
    created: new Date(
      new Date().getTime() + 10 * 60 * 60 * 1000
    ).toLocaleDateString(),
    amount_total: 1200,
  },
];


export const fakeDataPendingSessions = [
  {
    id: "1",
    created: new Date(
      new Date().getTime() + 12 * 60 * 60 * 1000
    ).toLocaleDateString(),
    amount_total: 1300,
  },
  {
    id: "2",
    created: new Date(
      new Date().getTime() + 18 * 60 * 60 * 1000
    ).toLocaleDateString(),
    amount_total: 900,
  },
  {
    id: "3",
    created: new Date(
      new Date().getTime() + 20 * 60 * 60 * 1000
    ).toLocaleDateString(),
    amount_total: 2200,
  },
];
