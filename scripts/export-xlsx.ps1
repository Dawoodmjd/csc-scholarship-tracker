Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-ExcelColumnName {
    param(
        [Parameter(Mandatory = $true)]
        [int]$Number
    )

    $name = ""
    while ($Number -gt 0) {
        $remainder = ($Number - 1) % 26
        $name = [char](65 + $remainder) + $name
        $Number = [math]::Floor(($Number - 1) / 26)
    }
    return $name
}

function Escape-XmlValue {
    param(
        [AllowNull()]
        [object]$Value
    )

    if ($null -eq $Value) {
        return ""
    }

    return [System.Security.SecurityElement]::Escape([string]$Value)
}

function Write-Utf8File {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path,

        [Parameter(Mandatory = $true)]
        [string]$Content
    )

    [System.IO.File]::WriteAllText($Path, $Content, [System.Text.UTF8Encoding]::new($false))
}

function New-XlsxFromCsv {
    param(
        [Parameter(Mandatory = $true)]
        [string]$CsvPath,

        [Parameter(Mandatory = $true)]
        [string]$OutputPath,

        [Parameter(Mandatory = $true)]
        [string]$SheetName
    )

    $rows = @(Import-Csv -Path $CsvPath)
    $headers = @()
    if ($rows.Count -gt 0) {
        $headers = @($rows[0].PSObject.Properties.Name)
    } else {
        $firstLine = Get-Content -Path $CsvPath -TotalCount 1
        if (-not [string]::IsNullOrWhiteSpace($firstLine)) {
            $headers = $firstLine.Split(",")
        }
    }

    $allRows = @()
    if ($headers.Count -gt 0) {
        $allRows += ,$headers
    }

    foreach ($row in $rows) {
        $values = @(foreach ($header in $headers) {
            $row.$header
        })
        $allRows += ,$values
    }

    $sheetRows = New-Object System.Collections.Generic.List[string]
    for ($r = 0; $r -lt $allRows.Count; $r++) {
        $rowIndex = $r + 1
        $cells = New-Object System.Collections.Generic.List[string]
        $currentRow = @($allRows[$r])

        for ($c = 0; $c -lt $currentRow.Count; $c++) {
            $columnName = Get-ExcelColumnName -Number ($c + 1)
            $cellRef = "$columnName$rowIndex"
            $value = Escape-XmlValue -Value $currentRow[$c]
            $styleId = if ($r -eq 0) { "1" } else { "0" }
            $cells.Add("<c r=""$cellRef"" t=""inlineStr"" s=""$styleId""><is><t>$value</t></is></c>")
        }

        $sheetRows.Add("<row r=""$rowIndex"">$($cells -join '')</row>")
    }

    $dimensionRef = if ($headers.Count -gt 0) {
        "A1:{0}{1}" -f (Get-ExcelColumnName -Number $headers.Count), [math]::Max($allRows.Count, 1)
    } else {
        "A1:A1"
    }

    $worksheetXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <dimension ref="$dimensionRef"/>
  <sheetViews>
    <sheetView workbookViewId="0"/>
  </sheetViews>
  <sheetFormatPr defaultRowHeight="15"/>
  <sheetData>
    $($sheetRows -join "`n    ")
  </sheetData>
</worksheet>
"@

    $workbookXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="$([System.Security.SecurityElement]::Escape($SheetName))" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>
"@

    $workbookRelsXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>
"@

    $rootRelsXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>
"@

    $contentTypesXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>
"@

    $stylesXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="2">
    <font>
      <sz val="11"/>
      <name val="Calibri"/>
    </font>
    <font>
      <b/>
      <sz val="11"/>
      <name val="Calibri"/>
    </font>
  </fonts>
  <fills count="2">
    <fill>
      <patternFill patternType="none"/>
    </fill>
    <fill>
      <patternFill patternType="gray125"/>
    </fill>
  </fills>
  <borders count="1">
    <border>
      <left/>
      <right/>
      <top/>
      <bottom/>
      <diagonal/>
    </border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="2">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>
  </cellXfs>
  <cellStyles count="1">
    <cellStyle name="Normal" xfId="0" builtinId="0"/>
  </cellStyles>
</styleSheet>
"@

    $now = [DateTime]::UtcNow.ToString("s") + "Z"
    $coreXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>$([System.Security.SecurityElement]::Escape($SheetName))</dc:title>
  <dc:creator>Codex</dc:creator>
  <cp:lastModifiedBy>Codex</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">$now</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">$now</dcterms:modified>
</cp:coreProperties>
"@

    $appXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Microsoft Excel</Application>
  <DocSecurity>0</DocSecurity>
  <ScaleCrop>false</ScaleCrop>
  <HeadingPairs>
    <vt:vector size="2" baseType="variant">
      <vt:variant>
        <vt:lpstr>Worksheets</vt:lpstr>
      </vt:variant>
      <vt:variant>
        <vt:i4>1</vt:i4>
      </vt:variant>
    </vt:vector>
  </HeadingPairs>
  <TitlesOfParts>
    <vt:vector size="1" baseType="lpstr">
      <vt:lpstr>$([System.Security.SecurityElement]::Escape($SheetName))</vt:lpstr>
    </vt:vector>
  </TitlesOfParts>
</Properties>
"@

    $outputDirectory = Split-Path -Parent $OutputPath
    if (-not (Test-Path -Path $outputDirectory)) {
        New-Item -ItemType Directory -Path $outputDirectory | Out-Null
    }

    $tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ([System.Guid]::NewGuid().ToString())
    New-Item -ItemType Directory -Path $tempRoot | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $tempRoot "_rels") | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $tempRoot "docProps") | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $tempRoot "xl") | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $tempRoot "xl\_rels") | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $tempRoot "xl\worksheets") | Out-Null

    Write-Utf8File -Path (Join-Path $tempRoot "[Content_Types].xml") -Content $contentTypesXml
    Write-Utf8File -Path (Join-Path $tempRoot "_rels\.rels") -Content $rootRelsXml
    Write-Utf8File -Path (Join-Path $tempRoot "docProps\core.xml") -Content $coreXml
    Write-Utf8File -Path (Join-Path $tempRoot "docProps\app.xml") -Content $appXml
    Write-Utf8File -Path (Join-Path $tempRoot "xl\workbook.xml") -Content $workbookXml
    Write-Utf8File -Path (Join-Path $tempRoot "xl\_rels\workbook.xml.rels") -Content $workbookRelsXml
    Write-Utf8File -Path (Join-Path $tempRoot "xl\styles.xml") -Content $stylesXml
    Write-Utf8File -Path (Join-Path $tempRoot "xl\worksheets\sheet1.xml") -Content $worksheetXml

    if (Test-Path -Path $OutputPath) {
        Remove-Item -Path $OutputPath -Force
    }

    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::CreateFromDirectory($tempRoot, $OutputPath)
    Remove-Item -Path $tempRoot -Recurse -Force
}

$root = Split-Path -Parent $PSScriptRoot
$outputRoot = Join-Path $root "workbooks"

$jobs = @(
    @{
        Csv = Join-Path $root "data\documents\required_documents.csv"
        Xlsx = Join-Path $outputRoot "required_documents.xlsx"
        Sheet = "Required Documents"
    },
    @{
        Csv = Join-Path $root "data\deadlines\csc_deadlines.csv"
        Xlsx = Join-Path $outputRoot "csc_deadlines.xlsx"
        Sheet = "CSC Deadlines"
    },
    @{
        Csv = Join-Path $root "data\universities\master_university_contacts.csv"
        Xlsx = Join-Path $outputRoot "master_university_contacts.xlsx"
        Sheet = "University Contacts"
    },
    @{
        Csv = Join-Path $root "data\universities\university_intake_template.csv"
        Xlsx = Join-Path $outputRoot "university_intake_template.xlsx"
        Sheet = "University Template"
    },
    @{
        Csv = Join-Path $root "data\universities\china_university_tiers.csv"
        Xlsx = Join-Path $outputRoot "china_university_tiers.xlsx"
        Sheet = "China University Tiers"
    },
    @{
        Csv = Join-Path $root "data\universities\csc_host_universities.csv"
        Xlsx = Join-Path $outputRoot "csc_host_universities.xlsx"
        Sheet = "CSC Host Universities"
    },
    @{
        Csv = Join-Path $root "data\programs\csc_program_catalog.csv"
        Xlsx = Join-Path $outputRoot "csc_program_catalog.xlsx"
        Sheet = "CSC Program Catalog"
    },
    @{
        Csv = Join-Path $root "data\programs\csc_program_requirements.csv"
        Xlsx = Join-Path $outputRoot "csc_program_requirements.xlsx"
        Sheet = "Program Requirements"
    },
    @{
        Csv = Join-Path $root "data\programs\csc_program_collection_queue.csv"
        Xlsx = Join-Path $outputRoot "csc_program_collection_queue.xlsx"
        Sheet = "Collection Queue"
    }
)

foreach ($job in $jobs) {
    New-XlsxFromCsv -CsvPath $job.Csv -OutputPath $job.Xlsx -SheetName $job.Sheet
    Write-Host "Created $($job.Xlsx)"
}
