<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:test="http://www.w3.org/2008/03/DOM3Events">
   <xsl:key name="citation-spec" match="/test-suite/citations/citation-spec" use="@name"/>

      <xsl:variable name="TargetLanguage" select="/test:test-suite/@targetLanguage" />
      <xsl:variable name="SourceOffsetPath" select="/test:test-suite/@SourceOffsetPath" />

   <xsl:template match="/">
      <html>
         <head>
            <title>DOM Level 3 Events Interoperability Test Suite</title>
            <LINK rel="stylesheet" type="text/css" href="DOM3StylesCatalog.css"/>             
         </head>
         <body>
            <xsl:if test="test:test-suite/@targetLanguage">
               <h1><xsl:value-of select="test:test-suite/@targetLanguage" /> Interoperability Test Suite</h1>
            </xsl:if>
            <xsl:if test="not( test:test-suite/@targetLanguage )">
               <h1>DOM 3 Events Interoperability Test Suite</h1>
            </xsl:if>
            <h6>[Version: <xsl:value-of select="test:test-suite/@version" /> Catalog Design Date: <xsl:value-of select="test:test-suite/@CatalogDesignDate" />]</h6>
            <h2>Introduction</h2>
            <P>
               The following document is an XSLT transform of the WEB API Working Group test catalog for the DOM 3 Events Test Suite. The test 
               catalog is an XML file containing meta-data about the DOM 3 Events interoperability 
               tests published by the WEB API Working Group. The meta-data serves to link test cases with 
               their required input sources and results as well as providing further 
               information about the tests (e.g. who the author was, what the purpose of the 
               test is) and categorizing the various tests into their relevant sections. For 
               further information and details about this catalog file, please visit the WEB API 
               wiki homepage at <A HREF="http://www.w3.org/2008/webapps/wiki/D3E_Test_Suite">http://www.w3.org/2008/webapps/wiki/D3E_Test_Suite</A>.
            </P>
            <h2>Citations</h2>
            <table class = "tb1">
               <tr clas = "tr1">
                  <th>Name</th>
                  <th>Description</th>
                  <th>Note</th>
               </tr>
               <xsl:apply-templates select="test:test-suite/test:citations/test:citation-spec" />
            </table>
            <h2>Sources</h2>
            <table class = "tb1">
               <tr class = "tr1">
                  <th>ID</th>
                  <th>Creator</th>
                  <th>Schema</th>
                  <th>File</th>
                  <th>Description</th>
               </tr>
               <xsl:for-each select="test:test-suite/test:sources/test:source">
                  <tr class="tr1">
                     <td class = "tc1">
                        <A>
                           <xsl:attribute name="name">
                              <xsl:value-of select="@ID"/>
                           </xsl:attribute>
                           <b>
                              <xsl:value-of select="@ID"/>
                           </b>
                        </A>
                     </td>
                     <td class = "tc1">
                        <xsl:value-of select="@Creator"/>
                     </td>
                     <td class="tc1">
                        <A>
                           <xsl:attribute name="href">#<xsl:value-of select="@schema"/></xsl:attribute>
                           <xsl:value-of select="@schema"/>								
                        </A>
                     </td>
                     <td>
                        <A>
                           <xsl:attribute name="href">
                              <xsl:value-of select="$SourceOffsetPath"/><xsl:value-of select="@FileName"/></xsl:attribute>
                           <xsl:value-of select="@FileName"/>
                        </A>
                     </td>
                     <td class = "tc1">
                        <xsl:value-of select="test:description"/>
                     </td>
                  </tr>
               </xsl:for-each>
            </table>
            <h2>Schemas</h2>
            <table class="tb1">
               <tr class = "tr1">
                  <th>ID</th>
                  <th>Type</th>
                  <th>URI</th>
                  <th>File Name</th>
               </tr>
               <xsl:for-each select="test:test-suite/test:sources/test:schema">
                  <tr class="tr1">
                     <td>
                        <A>
                           <xsl:attribute name="name">
                              <xsl:value-of select="@ID"/>
                           </xsl:attribute>
                           <b>
                              <xsl:value-of select="@ID"/>
                           </b>
                        </A>
                     </td>
                     <td>
                        <xsl:value-of select="@Type"/>
                     </td>
                     <td>
                        <A>
                           <xsl:attribute name="href"><xsl:value-of select="@URI"/></xsl:attribute>
                           <xsl:value-of select="@URI"/>
                        </A>
                     </td>
                     <td>
                        <A>
                           <xsl:attribute name="href"><xsl:value-of select="$SourceOffsetPath"/><xsl:value-of select="@FileName"/></xsl:attribute>
                           <xsl:value-of select="@FileName"/>
                        </A>
                     </td>
                  </tr>
               </xsl:for-each>
            </table>               
            <h2>Styles</h2>
            <table class= "tb1">
               <tr class = "tr1">
                  <th>ID</th>
                  <th>File Name</th>
               </tr>               
               <xsl:for-each select="test:test-suite/test:sources/test:style">
                  <tr class="tr1">
                     <td>
                        <A>
                           <xsl:attribute name="name">
                              <xsl:value-of select="@ID"/>
                           </xsl:attribute>
                           <b>
                              <xsl:value-of select="@ID"/>
                           </b>
                        </A>
                     </td>
                     <td>
                        <A>
                           <xsl:attribute name="href"><xsl:value-of select="$SourceOffsetPath"/><xsl:value-of select="@FileName"/></xsl:attribute>
                           <xsl:value-of select="@FileName"/>
                        </A>
                     </td>
                  </tr>
               </xsl:for-each>               
            </table>
            <h2>Test Groups</h2>
            <ul>
               <xsl:for-each select="test:test-suite/test:test-group">
                  <li>
                     <A>
                        <xsl:attribute name="href">#<xsl:value-of select="@name"/></xsl:attribute>
                        <xsl:number level="multiple" format="1.1" count="test:test-group"/>&#x20;<xsl:value-of select="test:GroupInfo/test:title"/></A>
                     <xsl:if test="@featureOwner">
                        &#x20;[<xsl:value-of select="@featureOwner" />]
                     </xsl:if>
                     <xsl:if test="test:test-group">
                        <ul>
                           <xsl:for-each select="test:test-group">
                              <li>
                                 <A>
                                    <xsl:attribute name="href">#<xsl:value-of select="@name"/></xsl:attribute>
                                    <xsl:number level="multiple" format="1.1" count="test:test-group"/>&#x20;<xsl:value-of select="test:GroupInfo/test:title"/></A>
                                 <xsl:if test="@featureOwner">
                                    &#x20;[<xsl:value-of select="@featureOwner" />]
                                 </xsl:if>
                              </li>
                           </xsl:for-each>
                        </ul>
                     </xsl:if>
                  </li>
               </xsl:for-each>
            </ul>
            <xsl:apply-templates select="test:test-suite/test:test-group" />
          </body>
      </html>
   </xsl:template>
   <xsl:template match="test:test-group">
      <A>
         <xsl:attribute name="name">
            <xsl:value-of select="@name"/>
         </xsl:attribute>
      </A>
      <h3>
         <xsl:number level="multiple" format="1.1" count="test:test-group"/>&#x20;<xsl:value-of select="test:GroupInfo/test:title" />
         <xsl:if test="@featureOwner">
            &#x20;[<xsl:value-of select="@featureOwner" />]
         </xsl:if>
      </h3>
      <p/>
      <xsl:value-of select="test:GroupInfo/test:description" />
      <p/>
      <ul>
         <xsl:for-each select="test:test-group">
            <li>
               <A>
                  <xsl:attribute name="href">#<xsl:value-of select="@name"/></xsl:attribute>
                  <xsl:number level="multiple" format="1.1" count="test:test-group"/>&#x20;<xsl:value-of select="test:GroupInfo/test:title"/></A>
               <xsl:if test="@featureOwner">
                  &#x20;[<xsl:value-of select="@featureOwner" />]
               </xsl:if>
               <xsl:if test="test:test-group">
                  <ul>
                     <xsl:for-each select="test:test-group">
                        <li>
                           <A>
                              <xsl:attribute name="href">#<xsl:value-of select="@name"/></xsl:attribute>
                              <xsl:number level="multiple" format="1.1" count="test:test-group"/>&#x20;<xsl:value-of select="test:GroupInfo/test:title"/></A>
                           <xsl:if test="@featureOwner">
                              &#x20;[<xsl:value-of select="@featureOwner" />]
                           </xsl:if>
                        </li>
                     </xsl:for-each>
                  </ul>
               </xsl:if>
            </li>
         </xsl:for-each>
      </ul>
      <xsl:apply-templates select="test:test-case" />
      <xsl:apply-templates select="test:test-group" />
   </xsl:template>

   <xsl:template match="test:test-case">
     <xsl:variable name = "FilePath" select = "@FilePath"/>
      <table width="80%" bgcolor="tan">
         <tr>
            <td>
               <b>
                 <A>
                  <xsl:attribute name="href">                 
                    <xsl:value-of select="concat($SourceOffsetPath,@FilePath,'/',@name,'.html')"/>
                  </xsl:attribute>
                  <xsl:value-of select="@name"/>                   
                 </A>                  
               </b>
            </td>
            <td>
               Date:
                <xsl:value-of select="@date"/>
            </td>
            <td>
               Creator:
               <xsl:value-of select="@Creator"/>
            </td>
         </tr>
         <tr>
            <td colspan="3">
               <B>Description:</B>
            </td>
         </tr>
         <tr>
            <td colspan="3">
               <xsl:value-of select="test:description"/>
            </td>
         </tr>
         <tr>
            <td colspan="3">
               <xsl:value-of select="test:query/test:description"/>
            </td>
         </tr>
         <tr>
            <td colspan="3">
               <B>Spec Citations:</B>
            </td>
         </tr>
         <xsl:for-each select="test:spec-citation">
            <xsl:variable name="spec-URI" select="key( 'citation-spec', @spec )/test:spec-URI" />
            <tr>
               <td colspan="3">
                  <A>
                     <xsl:attribute name="href">
                        <xsl:value-of select="$spec-URI"/><xsl:value-of select="@section-pointer"/>
                     </xsl:attribute>
                     <xsl:value-of select="$spec-URI"/><xsl:value-of select="@section-pointer"/>
                  </A>
               </td>
            </tr>
         </xsl:for-each>
         
         <xsl:if test="test:state">
            <tr>
               <td>
                  <B>Status:</B>
               </td>
               <td> 
                 <xsl:value-of select="test:state/@status"/>
               </td>
               <xsl:if test = "test:state/@reviewer">               
                <td>
                  <B>Reviewer:</B>
                </td>    
                <td> 
                 <xsl:value-of select="test:state/@reviewer"/>
                </td>                         
               </xsl:if>
            </tr>                        
         </xsl:if>       
         <xsl:if test = "test:input-file">
          <xsl:call-template name = "getInputs"/>      
         </xsl:if>
      </table>
      <p/>
   </xsl:template>
   <xsl:template match="test:citation-spec">
      <tr>
         <td>
            <A>
               <xsl:attribute name="name">
                  <xsl:value-of select="@name"/>
               </xsl:attribute>
               <xsl:attribute name="href">
                  <xsl:value-of select="test:spec-URI"/>
               </xsl:attribute>
               <b>
                  <xsl:value-of select="@name"/>
               </b>
            </A>
         </td>
         <td>
            <xsl:value-of select="test:description"/>
         </td>
         <td>
            <I>
               <xsl:value-of select="test:note"/>
            </I>
         </td>
      </tr>
   </xsl:template>

   <xsl:template name = "getInputs">
         <tr>
            <td colspan="3">
               <B>Inputs:</B>
            </td>
         </tr>    
         <xsl:for-each select="test:input-file">
            <tr>
               <td>
                  Role:
                  <A>
                     <xsl:attribute name="href">#<xsl:value-of select="@role"/></xsl:attribute>
                     <xsl:value-of select="@role"/>
                  </A>
               </td>
               <td colspan="2">
                  Source ID:
                  <A>
                     <xsl:attribute name="href">#<xsl:value-of select="."/></xsl:attribute>
                     <xsl:value-of select="."/>
                  </A>
               </td>
            </tr>
         </xsl:for-each>            
   </xsl:template>
</xsl:stylesheet>