const ucsbOrganizationFixtures = {
  oneOrganization: {
    orgCode: "OSLI",
    orgTranslationShort: "Student Life",
    orgTranslation: "Office of Student Life",
    inactive: false,
  },
  threeOrganizations: [
    {
      orgCode: "NSU",
      orgTranslationShort: "Nikkei Student Union",
      orgTranslation: "Nikkei Student Union at UCSB",
      inactive: false,
    },
    {
      orgCode: "TT",
      orgTranslationShort: "Table Tennis",
      orgTranslation: "Table Tennis Club at UCSB",
      inactive: false,
    },
    {
      orgCode: "KRC",
      orgTranslationShort: "Korean Radio",
      orgTranslation: "Korean Radio Club",
      inactive: true,
    },
  ],
};

export { ucsbOrganizationFixtures };
