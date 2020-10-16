# -*- coding: utf-8 -*-
"""Tiers.

@author: scott
"""

import pandas as pd

import utils


class TuiFilters:
    """Tui list for rescricting mappings."""

    tuis_1 = {
        "T053", "T054", "T055", "T017", "T018", "T021", "T022", "T023", "T024",
        "T025", "T026", "T029", "T030", "T031", "T109", "T114", "T116", "T121",
        "T123", "T125", "T126", "T127", "T129", "T131", "T192", "T196", "T079",
        "T080", "T081", "T082", "T102", "T169", "T185", "T034", "T038", "T032",
        "T039", "T040", "T041", "T042", "T043", "T044", "T045", "T201", "T019",
        "T020", "T033", "T037", "T046", "T047", "T048", "T049", "T050", "T184",
        "T190", "T191",
    }
    tuis_2 = {
        "T053", "T054", "T055", "T017", "T018", "T021", "T022", "T023", "T024",
        "T025", "T026", "T029", "T030", "T031", "T109", "T114", "T116", "T121",
        "T123", "T125", "T126", "T127", "T129", "T131", "T192", "T196", "T079",
        "T080", "T081", "T082", "T102", "T169", "T185", "T034", "T038", "T032",
        "T039", "T040", "T041", "T042", "T043", "T044", "T045", "T201", "T019",
        "T020", "T033", "T037", "T046", "T047", "T048", "T049", "T050", "T184",
        "T190", "T191",
    }
    tuis_3 = {
        "T053", "T054", "T055", "T017", "T018", "T021", "T022", "T023", "T024",
        "T025", "T026", "T029", "T030", "T031", "T109", "T114", "T116", "T121",
        "T123", "T125", "T126", "T127", "T129", "T131", "T192", "T196", "T079",
        "T080", "T081", "T082", "T102", "T169", "T185", "T034", "T038", "T032",
        "T039", "T040", "T041", "T042", "T043", "T044", "T045", "T201", "T019",
        "T020", "T033", "T037", "T046", "T047", "T048", "T049", "T050", "T184",
        "T190", "T191", "T059",
    }
    tuis_7 = {
        "T053", "T054", "T055", "T017", "T018", "T021", "T022", "T023", "T024",
        "T025", "T026", "T029", "T030", "T031", "T109", "T114", "T116", "T121",
        "T123", "T125", "T126", "T127", "T129", "T131", "T192", "T196", "T079",
        "T080", "T081", "T082", "T102", "T169", "T185", "T034", "T038", "T032",
        "T039", "T040", "T041", "T042", "T043", "T044", "T045", "T201", "T019",
        "T020", "T033", "T037", "T046", "T047", "T048", "T049", "T050", "T184",
        "T190", "T191",
    }
    tuis = {
        "T053", "T054", "T055", "T017", "T018", "T021", "T022", "T023", "T024",
        "T025", "T026", "T029", "T030", "T031", "T109", "T114", "T116", "T121",
        "T123", "T125", "T126", "T127", "T129", "T131", "T192", "T196", "T079",
        "T080", "T081", "T082", "T102", "T169", "T185", "T034", "T038", "T032",
        "T039", "T040", "T041", "T042", "T043", "T044", "T045", "T201", "T019",
        "T020", "T033", "T037", "T046", "T047", "T048", "T049", "T050", "T184",
        "T190", "T191",
    }


def run_tier(series: pd.Series, linker, nlp, max_results: int = None,
             confidence: float = None, tuis=None, entity_break=False,
             RequireNonObsoleteDef=False):
    """Get entity from series."""
    cache_key = hash(
        (nlp, linker, max_results if max_results is not None else '',
         confidence if confidence is not None else '',
         ''.join(tuis) if tuis is not None else '',
         entity_break, RequireNonObsoleteDef,))
    new_series = series.apply(utils.breakIntoSpansAndUMLS,
                              nlp=nlp,
                              linker=linker,
                              tuiFilter=tuis,
                              RequireNonObsoleteDef=RequireNonObsoleteDef,
                              confidence=confidence,
                              entity_break=entity_break,
                              cui_limit=max_results,
                              cache_key=cache_key,
                              )

    return new_series


def run_tiered_analysis(
        series: pd.Series, linker, nlp,
        ) -> pd.DataFrame:
    """Run a tiered analysis on endpoint-name."""
    print(f"Running tier 1 on {series.name}")
    t1 = run_tier(
        series, linker, nlp, 1, 0.98, TuiFilters.tuis_1,
        RequireNonObsoleteDef=True)
    nfound = len(t1.loc[t1.map(len) != 0])
    print(f'{nfound} names mapped')

    print(f"Running tier 2 on {series.name}")
    t2 = run_tier(
        series.loc[t1.loc[t1.map(len) == 0].index], linker, nlp, 1, 0.85,
        TuiFilters.tuis_2)
    nfound = len(t2.loc[t2.map(len) != 0])
    print(f'{nfound} names mapped')

    print(f"Running tier 3 on {series.name}")
    t3 = run_tier(
        series.loc[t2.loc[t2.map(len) == 0].index], linker, nlp, 1, 0.5,
        TuiFilters.tuis_3)
    nfound = len(t3.loc[t3.map(len) != 0])
    print(f'{nfound} names mapped')

    print(f"Running tier 4 on {series.name}")
    t4 = run_tier(
        series.loc[t3.loc[t3.map(len) == 0].index], linker, nlp, 1, 0.5, None)
    nfound = len(t4.loc[t4.map(len) != 0])
    print(f'{nfound} names mapped')

    print(f"Running tier 7 on {series.name}")
    t7 = run_tier(
        series.loc[t4.loc[t4.map(len) == 0].index], linker, nlp, 1, 0.85,
        TuiFilters.tuis_7, entity_break=True)
    nfound = len(t7.loc[t7.map(len) != 0])
    print(f'{nfound} names mapped')

    comb_tiers = pd.concat([pd.concat(
                                [t1, pd.Series('Tier 1', index=t1.index)],
                                axis=1).loc[t1.map(len) > 0],
                            pd.concat(
                                [t2, pd.Series('Tier 2', index=t2.index)],
                                axis=1).loc[t2.map(len) > 0],
                            pd.concat(
                                [t3, pd.Series('Tier 3', index=t3.index)],
                                axis=1).loc[t3.map(len) > 0],
                            pd.concat(
                                [t4, pd.Series('Tier 4', index=t4.index)],
                                axis=1).loc[t4.map(len) > 0],
                            pd.concat(
                                [t7, pd.Series('Tier 7', index=t7.index)],
                                axis=1).loc[t7.map(len) > 0],
                            pd.concat(
                                [t7, pd.Series('', index=t7.index)],
                                axis=1).loc[t7.map(len) == 0],
                            ]).sort_index()
    comb_tiers.columns = ['endpoint-name_UMLS', 'endpoint-name_Tier']
    # df_new = pd.concat([series, comb_tiers], axis=1)
    df_new = comb_tiers

    notfound = len(t7.loc[t7.map(len) == 0])
    df_new['endpoint-name_UMLS'] = df_new['endpoint-name_UMLS'] \
        .apply(utils.umls_to_string)
    print(f'Done, {notfound} names not mapped')
    return df_new


def main() -> pd.DataFrame:
    """Call methods and loading data."""
    df = pd.read_excel("HAWC-Ontologies-July2020v2.xlsx",
                       sheet_name="Preferred Terms List-July 2020",
                       usecols="A:C")

    # load model
    print('Loading models...')
    try:
        linker, nlp = utils.loadUMLSLinker(999, 0.5)
    except ConnectionError:
        linker, nlp = utils.loadUMLSLinker(999, 0.5)

    # organ
    print('Mapping endpoint-organ')
    df["endpoint-organ_UMLS"] = \
        run_tier(df["endpoint-organ"], linker, nlp, 1, 0.5, TuiFilters.tuis)

    # system
    print('Mapping endpoint-system')
    df["endpoint-system_UMLS"] = \
        run_tier(df["endpoint-system"], linker, nlp, 1, 0.5, TuiFilters.tuis)

    # name
    df["endpoint-name-flipped"] = df["endpoint-name"].apply(utils.flipOnComma)
    df_tier = run_tiered_analysis(df["endpoint-name-flipped"], linker, nlp)
    df = pd.concat([df, df_tier], axis=1)

    df = df[['endpoint-organ', 'endpoint-organ_UMLS',
             'endpoint-system', 'endpoint-system_UMLS',
             'endpoint-name', 'endpoint-name_UMLS', 'endpoint-name_Tier']]

    return df


if __name__ == "__main__":
    df = main()
    df.to_csv('icf_results.csv', index=False)